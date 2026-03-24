from fastapi import FastAPI, Depends, Request
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Product, CartItem
from schemas import ProductCreate, ProductResponse
from seed import seed_products
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ✅ NEW: Email imports
import smtplib
from email.mime.text import MIMEText

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- ROOT ----------------
@app.get("/")
def home():
    return {"message": "Grocery API running 🚀"}

# ---------------- PRODUCTS ----------------
@app.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.post("/add-product", response_model=ProductResponse)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.post("/seed")
def seed(db: Session = Depends(get_db)):
    seed_products(db)
    return {"message": "30 products added successfully"}

# ---------------- CART ----------------

class CartItemCreate(BaseModel):
    product_id: int
    name: str
    price: int
    quantity: int

@app.post("/cart")
def add_to_cart(item: CartItemCreate, db: Session = Depends(get_db)):
    db_item = CartItem(**item.dict())
    db.add(db_item)
    db.commit()
    return {"message": "Item added to cart"}

@app.get("/cart")
def get_cart(db: Session = Depends(get_db)):
    return db.query(CartItem).all()

@app.delete("/cart")
def clear_cart(db: Session = Depends(get_db)):
    db.query(CartItem).delete()
    db.commit()
    return {"message": "Cart cleared"}

# ---------------- CONTACT (EMAIL) ----------------

@app.post("/contact")
async def send_contact(request: Request):
    data = await request.json()

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    try:
        msg = MIMEText(f"""
New Contact Message

Name: {name}
Email: {email}
Message: {message}
""")

        msg["Subject"] = "New Contact Form Message"
        msg["From"] = "your_email@gmail.com"   # 👈 change this
        msg["To"] = "amanr835222@gmail.com"

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        # 👇 IMPORTANT: use App Password (not normal password)
        server.login("your_email@gmail.com", "your_app_password")

        server.send_message(msg)
        server.quit()

        return {"message": "Email sent successfully ✅"}

    except Exception as e:
        return {"error": str(e)}

        import razorpay
from fastapi import Body

# 🔑 apni keys yaha daalo
client = razorpay.Client(auth=("rzp_live_SVCKvRTPMPouRX", "zsCkcFxtxpQFgAMWQuK10tSM"))

@app.post("/create-order")
def create_order(data: dict = Body(...)):
    amount = data.get("amount")

    order = client.order.create({
        "amount": amount * 100,  # rupees → paise
        "currency": "INR",
        "payment_capture": 1
    })

    return order