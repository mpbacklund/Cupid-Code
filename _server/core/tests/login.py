from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class LoginTests(LiveServerTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox') # Chromium sandboxing gets murped by Docker and causes errors
        cls.selenium = webdriver.Chrome(options=chrome_options)
        cls.selenium.implicitly_wait(5) # Allow the front-end to render for 5 seconds
    
    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def test_homepage_is_signin(self):
        self.selenium.get(self.live_server_url)
        assert 'Sign In' in self.selenium.page_source
    
    def test_invaliduser_cant_signin(self):
        self.selenium.get(self.live_server_url)
        self.selenium.find_element(By.NAME, 'username').send_keys("idontexistyet")
        self.selenium.find_element(By.NAME, 'password').send_keys("soopersecretpassword")
        self.selenium.find_element(By.NAME, 'password').send_keys(Keys.RETURN)
        assert 'Invalid username and/or password!' in self.selenium.page_source

    # test that we can create a dater account
    def test_create_dater_account(self):
        self.selenium.get(self.live_server_url)
        self.selenium.find_element(By.XPATH, "//*[text()='Sign Up']").click()
        self.selenium.find_element(By.NAME, 'username').send_keys("newdater")
        self.selenium.find_element(By.NAME, 'email').send_keys("dater@dater.com")
        self.selenium.find_element(By.NAME, 'password').send_keys("VerySecurePassword")
        self.selenium.find_element(By.NAME, 'password').send_keys(Keys.RETURN)

        time.sleep(1)
        
        userType = self.selenium.get_cookie('accountType')['value']

        assert userType == 'Dater', "New user cookie not found. User creation failed."

    # test that we can create a cupid account
    def test_create_cupid_account(self):
        self.selenium.get(self.live_server_url)
        self.selenium.find_element(By.XPATH, "//*[text()='Become a Cupid']").click()
        self.selenium.find_element(By.NAME, 'username').send_keys("newcupid")
        self.selenium.find_element(By.NAME, 'email').send_keys("cupid@cupid.com")
        self.selenium.find_element(By.NAME, 'password').send_keys("VerySecurePassword")
        self.selenium.find_element(By.NAME, 'password').send_keys(Keys.RETURN)

        time.sleep(1)
        
        userType = self.selenium.get_cookie('accountType')['value']

        assert userType == 'Cupid', "New user cookie not found. User creation failed."

    