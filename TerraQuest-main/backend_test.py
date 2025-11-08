import requests
import sys
import json
from datetime import datetime

class TerraQuestAPITester:
    def __init__(self, base_url="https://sustain-game.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success:
                try:
                    response_data = response.json()
                    details += f" | Response: {json.dumps(response_data, indent=2)[:200]}..."
                    self.log_test(name, True, details)
                    return True, response_data
                except:
                    self.log_test(name, True, details)
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    details += f" | Error: {error_data}"
                except:
                    details += f" | Error: {response.text[:100]}"
                self.log_test(name, False, details)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@terraquest.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # Try to login with a test user
        login_data = {
            "email": "test@terraquest.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success and isinstance(response, list) and len(response) >= 8:
            # Check if we have the expected mock products
            barcodes = [p.get('barcode') for p in response]
            expected_barcodes = ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008']
            has_all_products = all(bc in barcodes for bc in expected_barcodes)
            
            if has_all_products:
                self.log_test("Mock Products Validation", True, f"Found all {len(expected_barcodes)} expected products")
            else:
                self.log_test("Mock Products Validation", False, f"Missing some expected products. Found: {barcodes}")
            
            return has_all_products
        return False

    def test_get_single_product(self):
        """Test getting a single product by barcode"""
        success, response = self.run_test(
            "Get Single Product (barcode 1001)",
            "GET",
            "products/1001",
            200
        )
        
        if success and response.get('name') == 'Coca-Cola':
            return True
        return False

    def test_scan_product(self):
        """Test scanning a product"""
        if not self.user_id:
            self.log_test("Scan Product", False, "No user_id available")
            return False
            
        scan_data = {
            "userId": self.user_id,
            "productBarcode": "1001"
        }
        
        success, response = self.run_test(
            "Scan Product",
            "POST",
            "scans",
            200,
            data=scan_data
        )
        
        if success and 'scan' in response and 'product' in response:
            return True
        return False

    def test_get_user_scans(self):
        """Test getting user scans"""
        if not self.user_id:
            self.log_test("Get User Scans", False, "No user_id available")
            return False
            
        success, response = self.run_test(
            "Get User Scans",
            "GET",
            f"scans/user/{self.user_id}",
            200
        )
        
        return success and isinstance(response, list)

    def test_get_leaderboard(self):
        """Test getting leaderboard"""
        success, response = self.run_test(
            "Get Leaderboard",
            "GET",
            "users/leaderboard",
            200
        )
        
        return success and isinstance(response, list)

    def test_get_challenges(self):
        """Test getting challenges"""
        success, response = self.run_test(
            "Get Challenges",
            "GET",
            "challenges",
            200
        )
        
        if success and isinstance(response, list) and len(response) >= 3:
            # Check for expected challenges
            titles = [c.get('title') for c in response]
            expected_titles = ['Eco Starter', 'Plastic-Free Week', 'Green Guardian Quest']
            has_all_challenges = all(title in titles for title in expected_titles)
            
            if has_all_challenges:
                self.log_test("Mock Challenges Validation", True, f"Found all {len(expected_titles)} expected challenges")
            else:
                self.log_test("Mock Challenges Validation", False, f"Missing some expected challenges. Found: {titles}")
            
            return has_all_challenges
        return False

    def test_get_rewards(self):
        """Test getting rewards"""
        success, response = self.run_test(
            "Get Rewards",
            "GET",
            "rewards",
            200
        )
        
        if success and isinstance(response, list) and len(response) >= 4:
            # Check for expected rewards
            names = [r.get('name') for r in response]
            expected_names = ['Plant a Tree', '₹50 EcoKart Coupon', 'Ocean Cleanup Support', '₹100 Organic Store Voucher']
            has_all_rewards = all(name in names for name in expected_names)
            
            if has_all_rewards:
                self.log_test("Mock Rewards Validation", True, f"Found all {len(expected_names)} expected rewards")
            else:
                self.log_test("Mock Rewards Validation", False, f"Missing some expected rewards. Found: {names}")
            
            return has_all_rewards
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        if not self.user_id:
            self.log_test("Get User Profile", False, "No user_id available")
            return False
            
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            f"users/{self.user_id}",
            200
        )
        
        if success and response.get('id') == self.user_id:
            return True
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting TerraQuest API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test registration first
        if not self.test_user_registration():
            print("❌ Registration failed, trying login...")
            if not self.test_user_login():
                print("❌ Both registration and login failed, stopping tests")
                return False
        
        # Run all other tests
        self.test_get_products()
        self.test_get_single_product()
        self.test_scan_product()
        self.test_get_user_scans()
        self.test_get_leaderboard()
        self.test_get_challenges()
        self.test_get_rewards()
        self.test_get_user_profile()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = TerraQuestAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())