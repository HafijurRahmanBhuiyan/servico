from django.core.management.base import BaseCommand
from services.models import Category, Service, ServiceFAQ, ServiceProcessStep
from promos.models import PromoCode
from users.models import User
import datetime

CATEGORIES = [
    {'slug': 'ac-repair', 'label': 'AC Repair', 'icon': '❄️', 'sort_order': 1},
    {'slug': 'cleaning', 'label': 'Cleaning', 'icon': '🧹', 'sort_order': 2},
    {'slug': 'beauty', 'label': 'Beauty & Spa', 'icon': '💆', 'sort_order': 3},
    {'slug': 'electrical', 'label': 'Electrical', 'icon': '⚡', 'sort_order': 4},
    {'slug': 'plumbing', 'label': 'Plumbing', 'icon': '🔧', 'sort_order': 5},
    {'slug': 'painting', 'label': 'Painting', 'icon': '🎨', 'sort_order': 6},
    {'slug': 'appliance', 'label': 'Appliance Repair', 'icon': '🏠', 'sort_order': 7},
    {'slug': 'carpentry', 'label': 'Carpentry', 'icon': '🪚', 'sort_order': 8},
    {'slug': 'pest-control', 'label': 'Pest Control', 'icon': '🐛', 'sort_order': 9},
    {'slug': 'car-wash', 'label': 'Car Wash', 'icon': '🚗', 'sort_order': 10},
    {'slug': 'gardening', 'label': 'Gardening', 'icon': '🌿', 'sort_order': 11},
    {'slug': 'laptop-repair', 'label': 'Laptop Repair', 'icon': '💻', 'sort_order': 12},
    {'slug': 'security', 'label': 'Security & CCTV', 'icon': '📷', 'sort_order': 13},
    {'slug': 'moving', 'label': 'Moving & Shifting', 'icon': '📦', 'sort_order': 14},
    {'slug': 'men-grooming', 'label': "Men's Grooming", 'icon': '💈', 'sort_order': 15},
    {'slug': 'water-heater', 'label': 'Water Heater', 'icon': '🌡️', 'sort_order': 16},
    {'slug': 'home-care', 'label': 'Home Care', 'icon': '🏡', 'sort_order': 17},
    {'slug': 'logistics', 'label': 'Logistics & Delivery', 'icon': '🚚', 'sort_order': 18},
    {'slug': 'beauty-personal', 'label': 'Beauty & Personal Care', 'icon': '💅', 'sort_order': 19},
    {'slug': 'wellness', 'label': 'Fitness & Wellness', 'icon': '🧘', 'sort_order': 20},
]

SERVICES = [
    {'category_slug': 'ac-repair', 'title': 'AC General Servicing', 'subtitle': 'Deep clean + gas check', 'icon': '❄️', 'price': 800, 'rating': 4.8, 'review_count': 3241, 'duration': '1\u20132 hrs', 'is_popular': True, 'badge': 'Most Booked', 'description': 'Professional AC servicing including coil cleaning, filter wash, gas pressure check and performance tuning.', 'includes': ['Coil cleaning (evaporator & condenser)', 'Filter wash & dry', 'Gas pressure check', 'Drain pipe cleaning & flush', 'Performance & temperature report', 'Fan blade cleaning', 'Electrical connections check']},
    {'category_slug': 'ac-repair', 'title': 'AC Gas Refill', 'subtitle': 'R22 & R410A refrigerant', 'icon': '❄️', 'price': 1200, 'rating': 4.7, 'review_count': 1830, 'duration': '1 hr', 'is_popular': False, 'description': 'Refrigerant refill for all AC brands. Includes leak detection and pressure test.', 'includes': ['Leak detection with UV dye', 'Pressure test (before & after)', 'Gas refill (R22/R32/R410A)', 'Post-fill performance check']},
    {'category_slug': 'cleaning', 'title': 'Home Deep Cleaning', 'subtitle': 'Full apartment top to bottom', 'icon': '🧹', 'price': 1200, 'rating': 4.7, 'review_count': 5820, 'duration': '3\u20135 hrs', 'is_popular': True, 'badge': 'Top Rated', 'description': 'Comprehensive deep clean of your entire home.', 'includes': ['Kitchen degreasing', 'Bathroom sanitization & descaling', 'Floor mopping (all rooms)', 'Window & glass wiping (interior)', 'Ceiling fan & light fixture dusting']},
    {'category_slug': 'cleaning', 'title': 'Kitchen Deep Cleaning', 'subtitle': 'Grease, grime, odour \u2014 gone', 'icon': '🍳', 'price': 900, 'rating': 4.8, 'review_count': 2200, 'duration': '2\u20133 hrs', 'is_popular': True, 'description': 'Intensive kitchen cleaning.', 'includes': ['Chimney internal cleaning', 'Stove burner deep degrease', 'Tile & backsplash scrubbing', 'Sink sanitization & descaling']},
    {'category_slug': 'cleaning', 'title': 'Sofa & Upholstery Cleaning', 'subtitle': 'Steam + shampoo treatment', 'icon': '🛋️', 'price': 650, 'rating': 4.6, 'review_count': 1420, 'duration': '1\u20132 hrs', 'is_popular': False, 'description': 'Professional sofa and upholstery cleaning.', 'includes': ['Pre-vacuum & dry brush', 'Shampoo treatment', 'Hot-water steam extraction', 'Stain spot treatment']},
    {'category_slug': 'beauty', 'title': 'Facial & Cleanup', 'subtitle': 'Parlour-grade at home', 'icon': '💆', 'price': 600, 'rating': 4.9, 'review_count': 2100, 'duration': '45\u201360 min', 'is_popular': True, 'badge': "Women's Pick", 'description': 'Professional facial treatment.', 'includes': ['Skin type analysis', 'Deep cleansing', 'Exfoliation & scrub', 'Steam therapy', 'Face mask', 'Toning & moisturizing']},
    {'category_slug': 'beauty', 'title': 'Bridal Makeup', 'subtitle': 'Full glam, 6-hr stay', 'icon': '💄', 'price': 5000, 'rating': 4.9, 'review_count': 620, 'duration': '2\u20133 hrs', 'is_popular': False, 'description': 'Professional bridal makeup by experienced artists.', 'includes': ['Pre-wedding trial session', 'HD foundation & contouring', 'Long-wear setting spray', 'Touch-up kit for the day']},
    {'category_slug': 'electrical', 'title': 'Electrical Wiring & Repair', 'subtitle': 'Fan, switch, socket, DB', 'icon': '⚡', 'price': 500, 'rating': 4.6, 'review_count': 1890, 'duration': '1\u20133 hrs', 'is_popular': False, 'description': 'Licensed electrician for all wiring needs.', 'includes': ['Socket/switch replacement', 'Fan installation & balancing', 'MCB/DB work', 'Light fixture fitting', 'Safety inspection & report']},
    {'category_slug': 'plumbing', 'title': 'Plumbing Repair', 'subtitle': 'Pipe, tap, commode, tank', 'icon': '🔧', 'price': 450, 'rating': 4.5, 'review_count': 2300, 'duration': '1\u20132 hrs', 'is_popular': True, 'description': 'Expert plumber for leaks, blockages, tap replacements.', 'includes': ['Leak detection & repair', 'Tap replacement & servicing', 'Commode repair & replacement', 'Drain unblocking']},
    {'category_slug': 'painting', 'title': 'Wall Painting (Per Room)', 'subtitle': '2 coats, all materials', 'icon': '🎨', 'price': 2500, 'rating': 4.7, 'review_count': 980, 'duration': '1 day', 'is_popular': False, 'description': 'Professional painters with 2 coats of premium paint.', 'includes': ['Surface prep & crack filling', 'Sanding & putty', 'Primer coat', '2 coats premium paint', 'Color consultation']},
    {'category_slug': 'appliance', 'title': 'Washing Machine Repair', 'subtitle': 'All brands, on-site fix', 'icon': '🏠', 'price': 700, 'rating': 4.6, 'review_count': 1450, 'duration': '1\u20132 hrs', 'is_popular': False, 'description': 'On-site diagnosis and repair for all washing machine brands.', 'includes': ['Free diagnosis', 'Motor & belt check', 'Pump & drain repair', 'Test wash cycle', '90-day service warranty']},
    {'category_slug': 'carpentry', 'title': 'Furniture Assembly', 'subtitle': 'IKEA, local & custom', 'icon': '🪚', 'price': 400, 'rating': 4.5, 'review_count': 760, 'duration': '1\u20133 hrs', 'is_popular': False, 'description': 'Professional assembly of all types of flat-pack or custom furniture.', 'includes': ['All tools provided', 'Careful handling of parts', 'Wall mounting if needed', 'Level & alignment check']},
    {'category_slug': 'pest-control', 'title': 'Pest Control (Apartment)', 'subtitle': 'Cockroach, rat, termite', 'icon': '🐛', 'price': 1500, 'rating': 4.4, 'review_count': 1120, 'duration': '1\u20132 hrs', 'is_popular': False, 'description': 'Comprehensive pest treatment using WHO-approved chemicals.', 'includes': ['Cockroach gel bait', 'Rodent bait stations', 'Mosquito & fly spray', '30-day re-visit guarantee']},
    {'category_slug': 'car-wash', 'title': 'Car Exterior Wash', 'subtitle': 'At your parking spot', 'icon': '🚗', 'price': 350, 'rating': 4.3, 'review_count': 890, 'duration': '45 min', 'is_popular': False, 'description': 'Full exterior hand wash at your building.', 'includes': ['Exterior hand wash', 'Tyre & rim cleaning', 'Glass wiping', 'Mirror cleaning']},
    {'category_slug': 'car-wash', 'title': 'Car Interior + Exterior Detail', 'subtitle': 'Full valet at home', 'icon': '🚗', 'price': 1200, 'rating': 4.7, 'review_count': 540, 'duration': '2\u20133 hrs', 'is_popular': False, 'description': 'Premium full-car detailing.', 'includes': ['Interior vacuum', 'Dashboard & console clean', 'Seat shampoo & dry', 'Exterior wash & polish', 'Tyre shine']},
    {'category_slug': 'laptop-repair', 'title': 'Laptop Repair & Service', 'subtitle': 'Hardware & software fix', 'icon': '💻', 'price': 600, 'rating': 4.5, 'review_count': 1300, 'duration': '1\u20133 hrs', 'is_popular': False, 'description': 'Certified technician for laptop screen, battery, keyboard, OS issues.', 'includes': ['Full diagnosis report', 'OS reinstall / clean', 'Virus & malware removal', 'Hardware repair', 'Data backup before repair']},
    {'category_slug': 'security', 'title': 'CCTV Camera Installation', 'subtitle': 'HD cameras + DVR setup', 'icon': '📷', 'price': 3500, 'rating': 4.8, 'review_count': 760, 'duration': '2\u20134 hrs', 'is_popular': True, 'description': 'Professional CCTV installation for homes and offices.', 'includes': ['Site survey & planning', 'Camera mounting', 'DVR/NVR setup & config', 'Mobile app remote access', '1-year installation warranty']},
    {'category_slug': 'security', 'title': 'Smart Door Lock Installation', 'subtitle': 'Fingerprint & PIN', 'icon': '🔐', 'price': 1800, 'rating': 4.7, 'review_count': 340, 'duration': '1\u20132 hrs', 'is_popular': False, 'description': 'Install and configure smart door locks.', 'includes': ['Lock installation', 'Fingerprint enrolment (up to 10)', 'PIN & app setup', 'Demo & training']},
    {'category_slug': 'moving', 'title': 'Home Shifting Service', 'subtitle': 'Packing + truck + unboxing', 'icon': '📦', 'price': 5000, 'rating': 4.5, 'review_count': 890, 'duration': 'Half day', 'is_popular': True, 'description': 'End-to-end home relocation.', 'includes': ['Packing materials provided', 'Fragile item wrapping', 'Furniture dismantling & reassembly', 'Loading & transport', 'Basic transit insurance']},
    {'category_slug': 'men-grooming', 'title': 'Haircut at Home (Men)', 'subtitle': 'Salon-style, your doorstep', 'icon': '💈', 'price': 300, 'rating': 4.7, 'review_count': 2890, 'duration': '30\u201345 min', 'is_popular': True, 'badge': "Men's Favourite", 'description': 'Professional barber at your doorstep.', 'includes': ['Haircut', 'Beard trim & shaping', 'Hot towel finish', 'Hair styling']},
]

PROMOS = [
    {'code': 'WELCOME20', 'type': 'percent', 'value': 20, 'min_order': 0, 'max_uses': 100, 'expiry': '2026-12-31'},
    {'code': 'FLAT100', 'type': 'flat', 'value': 100, 'min_order': 500, 'max_uses': 50, 'expiry': '2026-06-30'},
    {'code': 'SAVE50', 'type': 'flat', 'value': 50, 'min_order': 300, 'max_uses': 200, 'expiry': '2026-09-30'},
    {'code': 'PRO10', 'type': 'percent', 'value': 10, 'min_order': 0, 'max_uses': 500, 'expiry': '2026-08-31'},
]

class Command(BaseCommand):
    help = 'Seed the database with initial FNF Planet data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding categories...')
        cat_map = {}
        for cat in CATEGORIES:
            obj, _ = Category.objects.get_or_create(slug=cat['slug'], defaults=cat)
            cat_map[cat['slug']] = obj

        self.stdout.write('Seeding services...')
        for svc in SERVICES:
            slug = svc.pop('category_slug')
            category = cat_map.get(slug)
            if category:
                Service.objects.get_or_create(title=svc['title'], category=category, defaults=svc)
            svc['category_slug'] = slug

        self.stdout.write('Seeding promo codes...')
        for promo in PROMOS:
            import datetime as dt
            PromoCode.objects.get_or_create(
                code=promo['code'],
                defaults={**promo, 'expiry': dt.date.fromisoformat(promo['expiry'])}
            )

        self.stdout.write('Seeding admin user...')
        if not User.objects.filter(email='admin@servico.com').exists():
            User.objects.create_superuser(
                email='admin@servico.com',
                password='admin123',
                full_name='Admin',
            )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
