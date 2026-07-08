import cv2

print("Testing camera access...")
print("Available camera indices:")

# Test camera indices 0-5
for i in range(6):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"Camera {i}: Available")
        cap.release()
    else:
        print(f"Camera {i}: Not available")

print("\nAttempting to open camera 0...")
cap = cv2.VideoCapture(0)

if cap.isOpened():
    print("Camera 0 opened successfully")
    ret, frame = cap.read()
    if ret:
        print(f"Frame captured successfully. Shape: {frame.shape}")
        cv2.imwrite("test_frame.jpg", frame)
        print("Test frame saved as test_frame.jpg")
    else:
        print("Could not read frame from camera")
    cap.release()
else:
    print("Could not open camera 0")
    print("\nPossible causes:")
    print("1. No camera connected")
    print("2. Camera is in use by another application")
    print("3. Camera drivers not installed")
    print("4. Permission denied (check browser/system permissions)")
