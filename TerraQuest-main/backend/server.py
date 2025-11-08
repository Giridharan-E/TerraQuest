from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('SECRET_KEY', 'terraquest-secret-key-change-in-production')
ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    ecoScore: int = 0
    level: str = "Eco Rookie"
    totalScans: int = 0
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    barcode: str
    name: str
    carbonFootprint: int
    recyclable: bool
    ethicalScore: int
    sustainabilityScore: int
    brand: Optional[str] = ""
    category: Optional[str] = ""

class Scan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    productBarcode: str
    productName: str
    score: int
    scannedAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ScanCreate(BaseModel):
    userId: str
    productBarcode: str

class Challenge(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    requirement: str
    reward: int
    icon: str

class Reward(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    ngoName: str
    description: str
    pointsRequired: int
    icon: str

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def calculate_level(eco_score: int) -> str:
    if eco_score < 500:
        return "Eco Rookie"
    elif eco_score < 1000:
        return "Green Explorer"
    elif eco_score < 2000:
        return "Eco Guardian"
    elif eco_score < 3500:
        return "Sustainability Champion"
    else:
        return "Green Legend"

# Initialize mock data
async def init_db():
    # Check if products already exist
    existing = await db.products.count_documents({})
    if existing > 0:
        return
    
    # Mock products
    products = [
        {"barcode": "1001", "name": "Coca-Cola", "carbonFootprint": 65, "recyclable": False, "ethicalScore": 40, "sustainabilityScore": 45, "brand": "Coca-Cola", "category": "Beverages"},
        {"barcode": "1002", "name": "TATA Salt", "carbonFootprint": 20, "recyclable": True, "ethicalScore": 85, "sustainabilityScore": 80, "brand": "TATA", "category": "Grocery"},
        {"barcode": "1003", "name": "Dove Soap", "carbonFootprint": 45, "recyclable": True, "ethicalScore": 70, "sustainabilityScore": 65, "brand": "Dove", "category": "Personal Care"},
        {"barcode": "1004", "name": "Organic Honey", "carbonFootprint": 15, "recyclable": True, "ethicalScore": 95, "sustainabilityScore": 92, "brand": "Nature's Best", "category": "Food"},
        {"barcode": "1005", "name": "Plastic Water Bottle", "carbonFootprint": 80, "recyclable": False, "ethicalScore": 30, "sustainabilityScore": 35, "brand": "AquaPure", "category": "Beverages"},
        {"barcode": "1006", "name": "Bamboo Toothbrush", "carbonFootprint": 10, "recyclable": True, "ethicalScore": 98, "sustainabilityScore": 95, "brand": "EcoBrush", "category": "Personal Care"},
        {"barcode": "1007", "name": "Organic Cotton T-Shirt", "carbonFootprint": 25, "recyclable": True, "ethicalScore": 90, "sustainabilityScore": 88, "brand": "GreenWear", "category": "Clothing"},
        {"barcode": "1008", "name": "Instant Noodles", "carbonFootprint": 70, "recyclable": False, "ethicalScore": 45, "sustainabilityScore": 50, "brand": "QuickEat", "category": "Food"},
    ]
    await db.products.insert_many(products)
    
    # Mock challenges
    challenges = [
        {"id": "c1", "title": "Eco Starter", "description": "Scan 5 eco-friendly products this week", "requirement": "5 scans with score > 70", "reward": 100, "icon": "leaf"},
        {"id": "c2", "title": "Plastic-Free Week", "description": "Avoid products with low recyclability", "requirement": "7 days of high-score products", "reward": 200, "icon": "recycle"},
        {"id": "c3", "title": "Green Guardian Quest", "description": "Reach 1000 EcoScore", "requirement": "Total EcoScore >= 1000", "reward": 300, "icon": "trophy"},
    ]
    await db.challenges.insert_many(challenges)
    
    # Mock rewards
    rewards = [
        {"id": "r1", "name": "Plant a Tree", "ngoName": "GreenEarth Foundation", "description": "Fund one tree plantation", "pointsRequired": 500, "icon": "tree-pine"},
        {"id": "r2", "name": "₹50 EcoKart Coupon", "ngoName": "EcoKart", "description": "Shop sustainable products", "pointsRequired": 300, "icon": "shopping-bag"},
        {"id": "r3", "name": "Ocean Cleanup Support", "ngoName": "Blue Ocean Initiative", "description": "Support ocean plastic removal", "pointsRequired": 800, "icon": "waves"},
        {"id": "r4", "name": "₹100 Organic Store Voucher", "ngoName": "OrganicLife", "description": "Fresh organic produce", "pointsRequired": 600, "icon": "sprout"},
    ]
    await db.rewards.insert_many(rewards)

# Auth endpoints
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=user_data.name,
        email=user_data.email
    )
    user_dict = user.model_dump()
    user_dict['password'] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"user_id": user.id, "email": user.email})
    return {"user": user, "token": token}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    del user['password']
    token = create_access_token({"user_id": user['id'], "email": user['email']})
    return {"user": user, "token": token}

# Product endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{barcode}", response_model=Product)
async def get_product(barcode: str):
    product = await db.products.find_one({"barcode": barcode}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Scan endpoints
@api_router.post("/scans")
async def create_scan(scan_data: ScanCreate):
    # Get product
    product = await db.products.find_one({"barcode": scan_data.productBarcode}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create scan
    scan = Scan(
        userId=scan_data.userId,
        productBarcode=scan_data.productBarcode,
        productName=product['name'],
        score=product['sustainabilityScore']
    )
    await db.scans.insert_one(scan.model_dump())
    
    # Update user stats
    user = await db.users.find_one({"id": scan_data.userId}, {"_id": 0})
    if user:
        new_total_scans = user['totalScans'] + 1
        new_eco_score = user['ecoScore'] + product['sustainabilityScore']
        new_level = calculate_level(new_eco_score)
        
        await db.users.update_one(
            {"id": scan_data.userId},
            {"$set": {
                "totalScans": new_total_scans,
                "ecoScore": new_eco_score,
                "level": new_level
            }}
        )
    
    return {"scan": scan, "product": product}

@api_router.get("/scans/user/{user_id}")
async def get_user_scans(user_id: str):
    scans = await db.scans.find({"userId": user_id}, {"_id": 0}).sort("scannedAt", -1).to_list(100)
    return scans

# User endpoints
@api_router.get("/users/leaderboard")
async def get_leaderboard():
    users = await db.users.find({}, {"_id": 0, "password": 0}).sort("ecoScore", -1).limit(10).to_list(10)
    return users

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Challenge endpoints
@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges():
    challenges = await db.challenges.find({}, {"_id": 0}).to_list(100)
    return challenges

# Reward endpoints
@api_router.get("/rewards", response_model=List[Reward])
async def get_rewards():
    rewards = await db.rewards.find({}, {"_id": 0}).to_list(100)
    return rewards

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Database initialized with mock data")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()