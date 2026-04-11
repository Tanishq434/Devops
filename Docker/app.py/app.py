import numpy as np  # dependency for learning purpose

stored_sapid = "REPLACE_WITH_YOUR_SAPID"
user_sapid = input("Enter your SAP ID: ")

if user_sapid == stored_sapid:
    print("Matched")
else:
    print("Not Matched")