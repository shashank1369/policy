from PIL import Image
import pytesseract

# Specify path as a raw string
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
img = Image.open(r'C:\Users\GANESH VARDHAN\OneDrive\Pictures\Screenshots\list.png')
text = pytesseract.image_to_string(img)
print(text)