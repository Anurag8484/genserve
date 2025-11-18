from app import create_app
from extensions import db
from models.ticket import Ticket
from models.product import Product
from models.user import User
from models.component_order import ComponentOrder
from datetime import datetime, timedelta

def create_hardcoded_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create test users
        user1 = User(
            email="customer@test.com",
            name="John Customer",
            role="customer"
        )
        user1.set_password("password123")
        
        user2 = User(
            email="admin@test.com", 
            name="Admin User",
            role="admin"
        )
        user2.set_password("admin123")
        
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        
        # Create test products
        products = [
            Product(name="ThinkPad X1 Carbon", category="laptop", brand="Lenovo", price=1299.99),
            Product(name="Galaxy S24", category="mobile", brand="Samsung", price=899.99),
            Product(name="MacBook Pro 14", category="laptop", brand="Apple", price=1999.99),
            Product(name="iPhone 15 Pro", category="mobile", brand="Apple", price=1199.99),
            Product(name='OLED 65"', category="tv", brand="LG", price=1499.99),
            Product(name="Side-by-side Refrigerator", category="refrigerator", brand="Whirlpool", price=1899.99),
            # Add more products that match frontend options
            Product(name="Galaxy S23", category="mobile", brand="Samsung", price=799.99),
            Product(name="iPhone 14", category="mobile", brand="Apple", price=999.99),
            Product(name="Pixel 8 Pro", category="mobile", brand="Google", price=899.99),
            Product(name="OnePlus 12", category="mobile", brand="OnePlus", price=799.99),
            Product(name="Xiaomi 14", category="mobile", brand="Xiaomi", price=699.99),
            Product(name='QLED 55"', category="tv", brand="Samsung", price=1299.99),
            Product(name='LED 43"', category="tv", brand="Sony", price=599.99),
            Product(name='OLED 77"', category="tv", brand="LG", price=2499.99),
            Product(name='QLED 65"', category="tv", brand="Samsung", price=1599.99),
            Product(name='Smart TV 50"', category="tv", brand="TCL", price=799.99),
            Product(name="Dell XPS 15", category="laptop", brand="Dell", price=1799.99),
            Product(name="HP Spectre x360", category="laptop", brand="HP", price=1499.99),
            Product(name="ASUS ROG Strix", category="laptop", brand="ASUS", price=2199.99),
            Product(name="Surface Laptop 5", category="laptop", brand="Microsoft", price=1299.99),
        ]
        
        for product in products:
            db.session.add(product)
        db.session.commit()
        
        # Create test tickets with different statuses
        tickets_data = [
            {
                "description": "Laptop screen flickering intermittently during video calls",
                "status": "In Service",
                "customer_id": user1.id,
                "product_id": products[0].id,  # ThinkPad X1 Carbon
                "pickup_date": datetime.now() + timedelta(days=2),
                "preferred_time_slot": "2:00 PM - 4:00 PM",
                "contact": "+1 (555) 123-4567",
                "pickup_address": "123 Main Street, Apt 4B, New York, NY 10001"
            },
            {
                "description": "Mobile charging port is loose and won't hold cable properly",
                "status": "Picked",
                "customer_id": user1.id,
                "product_id": products[1].id,  # Galaxy S24
                "pickup_date": datetime.now() + timedelta(days=1),
                "preferred_time_slot": "10:00 AM - 12:00 PM", 
                "contact": "+1 (555) 987-6543",
                "pickup_address": "456 Oak Avenue, Suite 200, Boston, MA 02101"
            },
            {
                "description": "MacBook Pro randomly shuts down when battery is above 50%",
                "status": "Not Picked",
                "customer_id": user1.id,
                "product_id": products[2].id,  # MacBook Pro 14
                "pickup_date": datetime.now() + timedelta(days=3),
                "preferred_time_slot": "9:00 AM - 11:00 AM",
                "contact": "+1 (555) 456-7890", 
                "pickup_address": "789 Pine Street, Floor 3, San Francisco, CA 94102"
            },
            {
                "description": "iPhone camera app crashes when trying to record 4K video",
                "status": "Repaired",
                "customer_id": user1.id,
                "product_id": products[3].id,  # iPhone 15 Pro
                "pickup_date": datetime.now() + timedelta(days=1),
                "preferred_time_slot": "1:00 PM - 3:00 PM",
                "contact": "+1 (555) 234-5678",
                "pickup_address": "321 Cedar Lane, Unit 15B, Los Angeles, CA 90210"
            },
            {
                "description": "TV display has vertical lines and color distortion on the right side",
                "status": "Delivered", 
                "customer_id": user1.id,
                "product_id": products[4].id,  # OLED 55 TV
                "pickup_date": datetime.now() - timedelta(days=1),
                "preferred_time_slot": "3:00 PM - 5:00 PM",
                "contact": "+1 (555) 345-6789",
                "pickup_address": "654 Maple Drive, House 12, Chicago, IL 60601"
            }
        ]
        
        for ticket_data in tickets_data:
            ticket = Ticket(**ticket_data)
            db.session.add(ticket)
        
        db.session.commit()
        
        print(f"Created {len(products)} products and {len(tickets_data)} tickets")
        print("Sample tickets:")
        for ticket in Ticket.query.all():
            product = Product.query.get(ticket.product_id)
            print(f"- {ticket.id}: {product.name} - {ticket.description[:50]}... ({ticket.status})")
        
        # Create some sample component orders
        sample_orders = [
            ComponentOrder(
                order_id="P-1001",
                customer_id=user1.id,
                ticket_id=1,
                device_type="laptop",
                component_name="Battery",
                quantity=1,
                price=69.99,
                status="Active",
                service_tier="Gold",
                notes="Replacement battery for ThinkPad"
            ),
            ComponentOrder(
                order_id="P-1002", 
                customer_id=user1.id,
                ticket_id=2,
                device_type="mobile",
                component_name="Charging Port",
                quantity=1,
                price=29.99,
                status="Active",
                service_tier="Gold",
                notes="Charging port repair for Galaxy S24"
            ),
        ]
        
        for order in sample_orders:
            db.session.add(order)
        
        db.session.commit()
        
        print(f"Created {len(sample_orders)} sample component orders")

if __name__ == "__main__":
    create_hardcoded_data()