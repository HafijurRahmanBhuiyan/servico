// ─── Mock Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "c1",  slug: "ac-repair",       label: "AC Repair",         icon: "❄️",  image_url: "https://images.unsplash.com/photo-1631083211623-41e64ce3f74b?w=400&q=80" },
  { id: "c2",  slug: "cleaning",        label: "Cleaning",          icon: "🧹",  image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "c3",  slug: "beauty",          label: "Beauty & Spa",      icon: "💆",  image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" },
  { id: "c4",  slug: "electrical",      label: "Electrical",        icon: "⚡",  image_url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80" },
  { id: "c5",  slug: "plumbing",        label: "Plumbing",          icon: "🔧",  image_url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80" },
  { id: "c6",  slug: "painting",        label: "Painting",          icon: "🎨",  image_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80" },
  { id: "c7",  slug: "appliance",       label: "Appliance Repair",  icon: "🏠",  image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80" },
  { id: "c8",  slug: "carpentry",       label: "Carpentry",         icon: "🪚",  image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80" },
  { id: "c9",  slug: "pest-control",    label: "Pest Control",      icon: "🐛",  image_url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80" },
  { id: "c10", slug: "car-wash",        label: "Car Wash",          icon: "🚗",  image_url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&q=80" },
  { id: "c11", slug: "gardening",       label: "Gardening",         icon: "🌿",  image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: "c12", slug: "laptop-repair",   label: "Laptop Repair",     icon: "💻",  image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80" },
  { id: "c13", slug: "security",        label: "Security & CCTV",   icon: "📷",  image_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80" },
  { id: "c14", slug: "moving",          label: "Moving & Shifting",  icon: "📦", image_url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80" },
  { id: "c15", slug: "men-grooming",    label: "Men\'s Grooming",    icon: "💈",  image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
  { id: "c16", slug: "water-heater",    label: "Water Heater",      icon: "🌡️", image_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80" },
  { id: "c17", slug: "home-care",       label: "Home Care",         icon: "🏡",  image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { id: "c18", slug: "logistics",       label: "Logistics & Delivery", icon: "🚚", image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80" },
  { id: "c19", slug: "beauty-personal", label: "Beauty & Personal Care", icon: "💅", image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { id: "c20", slug: "wellness",        label: "Fitness & Wellness", icon: "🧘", image_url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80" },
];

const SERVICES = [
  // AC Repair
  { id:"s1", category_id:"c1", title:"AC General Servicing", subtitle:"Deep clean + gas check", icon:"❄️",
    image_url:"/images/pexels-raomubashir14-34754002.jpg",
    gallery:["/images/pexels-malama-mushitu-2148898721-34197977.jpg", "/images/pexels-readymade-3964736.jpg", "/images/pexels-shox-34048291.jpg"],
    price:800, rating:4.8, review_count:3241, duration:"1–2 hrs", is_popular:true, badge:"Most Booked",
    description:"Professional AC servicing including coil cleaning, filter wash, gas pressure check and performance tuning. Keeps your AC running at peak efficiency and reduces electricity bills by up to 20%.",
    long_description:"Our certified AC technicians perform a thorough 12-point inspection and cleaning service. Using industrial-grade equipment, we remove dust, grime, and biofilm from your evaporator and condenser coils. A clean AC consumes up to 20% less power, saving you money every month.",
    includes:["Coil cleaning (evaporator & condenser)","Filter wash & dry","Gas pressure check","Drain pipe cleaning & flush","Performance & temperature report","Fan blade cleaning","Electrical connections check"],
    process:[{step:1,title:"Inspection",desc:"Technician arrives and runs a full system check."},{step:2,title:"Disassembly",desc:"Front panel, filters and cover removed carefully."},{step:3,title:"Deep Clean",desc:"Coils, fan and drain line cleaned with industrial tools."},{step:4,title:"Reassembly & Test",desc:"Unit reassembled, gas checked, cooling performance confirmed."}],
    faq:[{q:"How long does it take?",a:"Usually 1–2 hours depending on AC type and dirt level."},{q:"Do I need to provide anything?",a:"Just ensure power access and a water point nearby. We bring all equipment."},{q:"How often should I service my AC?",a:"At least once a year, ideally before summer begins."},{q:"Is it safe for inverter ACs?",a:"Yes, our technicians are trained for all types including inverter, split, and window ACs."}],
    provider_stats:{jobs_done:3241,experience_years:5,satisfaction:98} },

  { id:"s1b", category_id:"c1", title:"AC Gas Refill", subtitle:"R22 & R410A refrigerant", icon:"❄️",
    image_url:"/images/pexels-salmansaqib-28456462.jpg",
    gallery:["/images/pexels-zeleboba-14534828.jpg"],
    price:1200, rating:4.7, review_count:1830, duration:"1 hr", is_popular:false,
    description:"Refrigerant refill for all AC brands. Includes leak detection and pressure test before and after filling.",
    long_description:"Low refrigerant is one of the most common causes of poor AC cooling. Our technicians use professional gauges to accurately measure and refill your AC with the correct refrigerant type.",
    includes:["Leak detection with UV dye","Pressure test (before & after)","Gas refill (R22/R32/R410A)","Post-fill performance check","Leak repair (if minor)"],
    process:[{step:1,title:"Pressure Check",desc:"Gauge connected to check current refrigerant level."},{step:2,title:"Leak Test",desc:"UV dye and detector used to find any leaks."},{step:3,title:"Refill",desc:"Correct refrigerant added to manufacturer spec."},{step:4,title:"Performance Test",desc:"Cooling tested at outlet to confirm improvement."}],
    faq:[{q:"Which gas types do you support?",a:"We support R22, R32, and R410A refrigerants for all major brands."}],
    provider_stats:{jobs_done:1830,experience_years:4,satisfaction:96} },

  // Cleaning
  { id:"s2", category_id:"c2", title:"Home Deep Cleaning", subtitle:"Full apartment top to bottom", icon:"🧹",
    image_url:"/images/pexels-liliana-drew-9462139.jpg",
    gallery:["/images/pexels-liliana-drew-9462316.jpg", "/images/pexels-liliana-drew-9462643.jpg", "/images/pexels-polina-tankilevitch-4440533.jpg"],
    price:1200, rating:4.7, review_count:5820, duration:"3–5 hrs", is_popular:true, badge:"Top Rated",
    description:"Comprehensive deep clean of your entire home. Our trained team uses professional-grade equipment and eco-friendly products.",
    long_description:"Our deep cleaning service goes far beyond regular sweeping and mopping. We tackle hidden grime in corners, behind appliances, inside cabinets, and on ceiling fans. Using commercial-grade equipment and eco-certified cleaning agents, our 2–3 person team leaves your home genuinely spotless.",
    includes:["Kitchen degreasing (stove, tiles, sink)","Bathroom sanitization & descaling","Floor mopping (all rooms)","Window & glass wiping (interior)","Ceiling fan & light fixture dusting","Cabinet exterior wipe-down","Balcony sweep & mop"],
    process:[{step:1,title:"Assessment",desc:"Team walks through to plan the cleaning order."},{step:2,title:"Dry Clean",desc:"Dusting, vacuuming, sweeping all surfaces."},{step:3,title:"Wet Clean",desc:"Mopping, scrubbing, sanitizing bathrooms and kitchen."},{step:4,title:"Final Check",desc:"Supervisor inspects every room before wrap-up."}],
    faq:[{q:"Will you bring cleaning supplies?",a:"Yes, all supplies and equipment included."},{q:"How many cleaners come?",a:"2–3 cleaners depending on apartment size."},{q:"Do I need to be home?",a:"You can be home or leave a key — your choice."}],
    provider_stats:{jobs_done:5820,experience_years:6,satisfaction:97} },

  { id:"s11", category_id:"c2", title:"Kitchen Deep Cleaning", subtitle:"Grease, grime, odour — gone", icon:"🍳",
    image_url:"/images/pexels-tima-miroshnichenko-6195118.jpg",
    gallery:["/images/pexels-polina-tankilevitch-5583126.jpg", "/images/pexels-tima-miroshnichenko-6195949.jpg", "/images/pexels-tima-miroshnichenko-6195952.jpg"],
    price:900, rating:4.8, review_count:2200, duration:"2–3 hrs", is_popular:true,
    description:"Intensive kitchen cleaning: chimney, stove, tiles, sink, and all surfaces thoroughly degreased.",
    long_description:"Kitchens are the hardest room to clean well. Our kitchen specialists use commercial degreasers and steam to cut through built-up grease on chimneys, stoves, tiles, and under-counter surfaces.",
    includes:["Chimney internal cleaning","Stove burner deep degrease","Tile & backsplash scrubbing","Sink sanitization & descaling","Shelf & cabinet wipe","Floor deep mop","Odour neutralizer spray"],
    process:[{step:1,title:"Pre-soak",desc:"Degreasers applied to chimney, stove and tiles."},{step:2,title:"Scrub",desc:"Manual and machine scrubbing of all surfaces."},{step:3,title:"Rinse & Sanitize",desc:"Surfaces rinsed and food-safe sanitizer applied."},{step:4,title:"Odour Treatment",desc:"Kitchen deodorized for long-lasting freshness."}],
    faq:[],
    provider_stats:{jobs_done:2200,experience_years:4,satisfaction:98} },

  { id:"s2c", category_id:"c2", title:"Sofa & Upholstery Cleaning", subtitle:"Steam + shampoo treatment", icon:"🛋️",
    image_url:"/images/pexels-alonssus-4401535.jpg",
    gallery:["/images/pexels-alonssus-4401537.jpg"],
    price:650, rating:4.6, review_count:1420, duration:"1–2 hrs", is_popular:false,
    description:"Professional sofa and upholstery cleaning using hot-water extraction and fabric-safe shampoo.",
    long_description:"Your sofa harbors more bacteria, dust mites, and allergens than you'd imagine. Our hot-water extraction method penetrates deep into fabric fibers, lifting embedded dirt, pet hair, stains, and odour-causing bacteria.",
    includes:["Pre-vacuum & dry brush","Shampoo treatment","Hot-water steam extraction","Stain spot treatment","Deodorizing & fabric freshener","Quick-dry process"],
    process:[{step:1,title:"Pre-Vacuum",desc:"Loose debris removed from all sofa surfaces."},{step:2,title:"Shampoo Apply",desc:"Fabric-safe shampoo worked into fibers."},{step:3,title:"Steam Extract",desc:"Hot-water machine pulls out dirt and shampoo."},{step:4,title:"Dry & Deodorize",desc:"Fan-dried and freshener applied."}],
    faq:[{q:"Is it safe for leather sofas?",a:"We use specific leather-safe products and conditioner for leather upholstery."}],
    provider_stats:{jobs_done:1420,experience_years:3,satisfaction:95} },

  // Beauty & Spa
  { id:"s3", category_id:"c3", title:"Facial & Cleanup", subtitle:"Parlour-grade at home", icon:"💆",
    image_url:"/images/pexels-alexandre-saraiva-carniato-583650-5853395.jpg",
    gallery:["/images/pexels-andreamostiphotography-18127468.jpg", "/images/pexels-bulat-6448562.jpg"],
    price:600, rating:4.9, review_count:2100, duration:"45–60 min", is_popular:true, badge:"Women\'s Pick",
    description:"Professional facial treatment with skin analysis, cleansing, exfoliation, steam, extraction and mask — all at your doorstep.",
    long_description:"Skip the salon commute. Our trained beauty professionals bring a full facial experience to your home. Each session begins with a skin type analysis to tailor the treatment exactly to your skin\'s needs.",
    includes:["Skin type analysis","Deep cleansing","Exfoliation & scrub","Steam therapy","Blackhead extraction","Face mask (skin-type specific)","Toning & moisturizing"],
    process:[{step:1,title:"Consultation",desc:"Skin assessed for type, concerns, and sensitivities."},{step:2,title:"Cleanse & Exfoliate",desc:"Pores opened with steam after thorough cleanse."},{step:3,title:"Treatment",desc:"Mask applied, extraction done if needed."},{step:4,title:"Finish",desc:"Toner and moisturizer applied, glow revealed."}],
    faq:[{q:"Are products hygienic?",a:"Yes, single-use products and sterilized tools for each customer."},{q:"Is it safe for sensitive skin?",a:"Yes, we use dermatologist-tested, hypoallergenic products on request."}],
    provider_stats:{jobs_done:2100,experience_years:5,satisfaction:99} },

  { id:"s3b", category_id:"c3", title:"Full Body Massage", subtitle:"Swedish & deep tissue", icon:"💆",
    image_url:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    gallery:["https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80","https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"],
    price:1000, rating:4.8, review_count:980, duration:"60–90 min", is_popular:false,
    description:"Relaxing full-body massage by certified therapists at your home. Choose from Swedish, deep tissue, or aromatherapy styles.",
    long_description:"Unwind without leaving your home. Our certified massage therapists bring a portable professional massage table and premium oils. Choose your pressure and style — gentle Swedish, firm deep-tissue, or fragrant aromatherapy.",
    includes:["Pre-session consultation","Full-body massage (back, legs, arms)","Premium massage oil","Choice of technique","Hot towel finish","Cool-down & hydration advice"],
    process:[{step:1,title:"Setup",desc:"Table set up in your preferred room with ambience."},{step:2,title:"Consultation",desc:"Pressure preference and problem areas discussed."},{step:3,title:"Massage",desc:"60–90 min professional full-body session."},{step:4,title:"Cool Down",desc:"Hot towel finish and aftercare tips shared."}],
    faq:[{q:"Do I need to provide a massage table?",a:"No, our therapist brings a portable, professional-grade table."}],
    provider_stats:{jobs_done:980,experience_years:4,satisfaction:97} },

  { id:"s3c", category_id:"c3", title:"Bridal Makeup", subtitle:"Full glam, 6-hr stay", icon:"💄",
    image_url:"/images/pexels-adeteroshniamaacademy-30452324.jpg",
    gallery:["/images/pexels-adeteroshniamaacademy-30795542.jpg", "/images/pexels-adeteroshniamaacademy-30795554.jpg", "/images/pexels-sami-aksu-48867324-8931963.jpg"],
    price:5000, rating:4.9, review_count:620, duration:"2–3 hrs", is_popular:false,
    description:"Professional bridal makeup by experienced artists. Includes trial session, skin prep, and touch-up kit for the day.",
    long_description:"Your wedding day deserves perfection. Our bridal makeup artists specialize in looks that photograph beautifully and last all day. A pre-wedding trial is included so you\'re 100% confident before the big day.",
    includes:["Pre-wedding trial session","Skin prep & primer","HD foundation & contouring","Full eye & lip work","Long-wear setting spray","Touch-up kit for the day","6-hour artist availability"],
    process:[{step:1,title:"Trial Session",desc:"Full look done 1–2 weeks before wedding for approval."},{step:2,title:"Skin Prep",desc:"Cleanse, moisturize, primer for long-lasting base."},{step:3,title:"Full Glam",desc:"HD foundation, contouring, eyes, lips — complete look."},{step:4,title:"Set & Stay",desc:"Setting spray, touch-up kit provided, artist stays 6 hrs."}],
    faq:[{q:"Is a trial included?",a:"Yes, a pre-wedding trial session is included in the package."},{q:"What products are used?",a:"We use MAC, NARS, Charlotte Tilbury, and other premium brands."}],
    provider_stats:{jobs_done:620,experience_years:7,satisfaction:99} },

  // Electrical
  { id:"s4", category_id:"c4", title:"Electrical Wiring & Repair", subtitle:"Fan, switch, socket, DB", icon:"⚡",
    image_url:"/images/pexels-farlight-34969202.jpg",
    gallery:["/images/pexels-dinesh-kandel-2152317096-34729450.jpg", "/images/pexels-estoymhrb-21316248.jpg", "/images/pexels-karola-g-7285975.jpg"],
    price:500, rating:4.6, review_count:1890, duration:"1–3 hrs", is_popular:false,
    description:"Licensed electrician for all wiring needs — from socket replacement to complete rewiring.",
    long_description:"Our BTEB-certified electricians handle everything from a single socket replacement to full apartment rewiring. Safety is our top priority — every job includes a final insulation and load test.",
    includes:["Socket/switch replacement","Fan installation & balancing","MCB/DB work","Light fixture fitting","Safety inspection & report","Wire routing & concealment"],
    process:[{step:1,title:"Inspect",desc:"Electrician assesses existing wiring and identifies issues."},{step:2,title:"Plan",desc:"Scope of work and materials confirmed."},{step:3,title:"Execute",desc:"All electrical work done per Bangladesh Electrical Code."},{step:4,title:"Safety Test",desc:"Load test and insulation check before sign-off."}],
    faq:[{q:"Is the electrician certified?",a:"Yes, all our electricians are BTEB certified and insured."}],
    provider_stats:{jobs_done:1890,experience_years:5,satisfaction:95} },

  // Plumbing
  { id:"s5", category_id:"c5", title:"Plumbing Repair", subtitle:"Pipe, tap, commode, tank", icon:"🔧",
    image_url:"/images/pexels-ar-abnoy-536397811-16509869.jpg",
    gallery:["/images/pexels-john-diez-7389083.jpg", "/images/pexels-jose-antonio-otegui-auzmendi-2150489988-34930117.jpg", "/images/pexels-matilda-wormwood-4098780.jpg"],
    price:450, rating:4.5, review_count:2300, duration:"1–2 hrs", is_popular:true,
    description:"Expert plumber for leaks, blockages, tap replacements, and water tank issues.",
    long_description:"Water leaks waste thousands of litres per year and can cause structural damage. Our expert plumbers diagnose and fix issues fast — from dripping taps to major pipe leaks, blocked drains, and tank problems.",
    includes:["Leak detection & repair","Tap replacement & servicing","Commode repair & replacement","Pipe fitting & joints","Drain unblocking","Water tank cleaning & repair"],
    process:[{step:1,title:"Diagnose",desc:"Plumber locates the root cause of the issue."},{step:2,title:"Quote",desc:"Parts and cost confirmed before work starts."},{step:3,title:"Repair",desc:"All repairs made with quality fittings."},{step:4,title:"Test",desc:"All connections tested under pressure before leaving."}],
    faq:[],
    provider_stats:{jobs_done:2300,experience_years:5,satisfaction:94} },

  // Painting
  { id:"s6", category_id:"c6", title:"Wall Painting (Per Room)", subtitle:"2 coats, all materials", icon:"🎨",
    image_url:"/images/pexels-ivan-s-5659012.jpg",
    gallery:["/images/pexels-bulat843-1243575272-33388384.jpg", "/images/pexels-bulat843-1243575272-33531809.jpg", "/images/pexels-ivan-s-5798978.jpg"],
    price:2500, rating:4.7, review_count:980, duration:"1 day", is_popular:false,
    description:"Professional painters with 2 coats of premium paint. All prep work and materials included.",
    long_description:"A fresh coat of paint transforms a room entirely. Our professional painters prep surfaces meticulously — filling cracks, sanding, applying primer — before 2 full coats of premium emulsion.",
    includes:["Surface prep & crack filling","Sanding & putty","Primer coat","2 coats premium paint","Color consultation","Furniture protection","Cleanup after job"],
    process:[{step:1,title:"Prep",desc:"Furniture covered, walls sanded and filled."},{step:2,title:"Prime",desc:"Primer coat applied for better adhesion."},{step:3,title:"Paint",desc:"2 coats of selected color applied evenly."},{step:4,title:"Finish",desc:"Touch-ups done, room cleaned and furniture uncovered."}],
    faq:[{q:"Can I choose the color?",a:"Absolutely! We\'ll help you pick the right shade and finish."}],
    provider_stats:{jobs_done:980,experience_years:6,satisfaction:96} },

  // Appliance
  { id:"s7", category_id:"c7", title:"Washing Machine Repair", subtitle:"All brands, on-site fix", icon:"🏠",
    image_url:"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    gallery:["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80"],
    price:700, rating:4.6, review_count:1450, duration:"1–2 hrs", is_popular:false,
    description:"On-site diagnosis and repair for all washing machine brands and models.",
    long_description:"Our appliance technicians carry spare parts for all major brands, meaning most repairs are completed in a single visit. We diagnose the root cause — not just the symptom — for a lasting fix.",
    includes:["Free diagnosis","Motor & belt check","Control board diagnosis","Pump & drain repair","Test wash cycle","90-day service warranty"],
    process:[{step:1,title:"Diagnose",desc:"Run error code scan and manual inspection."},{step:2,title:"Quote",desc:"Transparent cost before any parts replaced."},{step:3,title:"Repair",desc:"Faulty parts replaced with genuine spares."},{step:4,title:"Test",desc:"Test wash cycle run before technician leaves."}],
    faq:[],
    provider_stats:{jobs_done:1450,experience_years:4,satisfaction:95} },

  { id:"s7b", category_id:"c7", title:"Refrigerator Repair", subtitle:"Cooling & compressor issues", icon:"🧊",
    image_url:"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
    gallery:[],
    price:750, rating:4.5, review_count:1100, duration:"1–2 hrs", is_popular:false,
    description:"Expert fridge repair for all brands — compressor, thermostat, door seals, and gas issues.",
    long_description:"Is your fridge not cooling, making noise, or leaking water? Our refrigerator technicians diagnose and fix all issues on-site with same-day parts.",
    includes:["Full diagnosis","Compressor check","Gas refill if needed","Thermostat repair","Door seal replacement","Ice maker check"],
    process:[{step:1,title:"Diagnose",desc:"Temperature and component checks performed."},{step:2,title:"Quote",desc:"Issue explained, cost approved."},{step:3,title:"Fix",desc:"Repair or parts replacement completed."},{step:4,title:"Test",desc:"Temperature monitored for 20 mins before leaving."}],
    faq:[],
    provider_stats:{jobs_done:1100,experience_years:4,satisfaction:94} },

  // Carpentry
  { id:"s8", category_id:"c8", title:"Furniture Assembly", subtitle:"IKEA, local & custom", icon:"🪚",
    image_url:"/images/pexels-szafran-19403712.jpg",
    gallery:[],
    price:400, rating:4.5, review_count:760, duration:"1–3 hrs", is_popular:false,
    description:"Professional assembly of all types of flat-pack or custom furniture.",
    long_description:"Our experienced carpenters assemble furniture correctly the first time — no stripped screws, no wobble, no leftover parts.",
    includes:["All tools provided","Careful handling of parts","Wall mounting if needed","Level & alignment check","Old packaging disposal"],
    process:[{step:1,title:"Unpack",desc:"All parts laid out and inventoried."},{step:2,title:"Assemble",desc:"Methodical assembly per instructions."},{step:3,title:"Mount",desc:"Wall-fixing done securely if required."},{step:4,title:"Check",desc:"All joints checked for stability."}],
    faq:[],
    provider_stats:{jobs_done:760,experience_years:3,satisfaction:95} },

  // Pest Control
  { id:"s9", category_id:"c9", title:"Pest Control (Apartment)", subtitle:"Cockroach, rat, termite", icon:"🐛",
    image_url:"/images/pexels-kindelmedia-6869051.jpg",
    gallery:["/images/pexels-kindelmedia-6994261.jpg"],
    price:1500, rating:4.4, review_count:1120, duration:"1–2 hrs", is_popular:false,
    description:"Comprehensive pest treatment using WHO-approved chemicals. Safe for family and pets after 2 hours.",
    long_description:"Our licensed pest control technicians use WHO-approved, low-toxicity chemicals. A 30-day re-visit guarantee means if pests return, so do we.",
    includes:["Cockroach gel bait","Rodent bait stations","Mosquito & fly spray","Termite inspection","Kitchen & bathroom treatment","30-day re-visit guarantee"],
    process:[{step:1,title:"Inspect",desc:"Pest species and infestation level assessed."},{step:2,title:"Treatment Plan",desc:"Targeted chemicals and traps selected."},{step:3,title:"Apply",desc:"Treatment applied in all hiding spots."},{step:4,title:"Advise",desc:"Prevention tips shared, follow-up scheduled."}],
    faq:[{q:"Is it safe for kids?",a:"Yes, safe after 2 hours of ventilation. We\'ll advise you."}],
    provider_stats:{jobs_done:1120,experience_years:4,satisfaction:93} },

  // Car Wash
  { id:"s10", category_id:"c10", title:"Car Exterior Wash", subtitle:"At your parking spot", icon:"🚗",
    image_url:"/images/pexels-fotografia-lui-vlad-1445510816-31862950.jpg",
    gallery:["/images/pexels-abhishek-sriram-590401644-37125859.jpg", "/images/pexels-chipi1189-37059837.jpg", "/images/pexels-gustavo-fring-6870311.jpg"],
    price:350, rating:4.3, review_count:890, duration:"45 min", is_popular:false,
    description:"Full exterior hand wash, rinse, wipe and tyre clean — right at your building.",
    long_description:"Our team comes to your parking spot with all equipment. We leave your car gleaming without you moving it.",
    includes:["Exterior hand wash","Tyre & rim cleaning","Glass wiping","Mirror cleaning","Door jamb wipe","Air freshener"],
    process:[{step:1,title:"Rinse",desc:"Pre-rinse to remove loose dirt and dust."},{step:2,title:"Wash",desc:"Car shampoo applied and hand-washed."},{step:3,title:"Detail",desc:"Tyres, glass, and mirrors detailed."},{step:4,title:"Dry",desc:"Microfiber drying to prevent water spots."}],
    faq:[],
    provider_stats:{jobs_done:890,experience_years:2,satisfaction:92} },

  { id:"s10b", category_id:"c10", title:"Car Interior + Exterior Detail", subtitle:"Full valet at home", icon:"🚗",
    image_url:"/images/pexels-19x14-8478268.jpg",
    gallery:["/images/pexels-0ldpikes-29284925.jpg", "/images/pexels-alexander-mass-748453803-33461079.jpg", "/images/pexels-gratisography-474.jpg"],
    price:1200, rating:4.7, review_count:540, duration:"2–3 hrs", is_popular:false,
    description:"Premium full-car detailing including interior vacuum, dashboard wipe, seat shampooing, and exterior polish.",
    long_description:"Our premium valet service is a complete car transformation inside and out. Your car leaves looking and smelling showroom fresh.",
    includes:["Interior vacuum (all surfaces)","Dashboard & console clean","Seat shampoo & dry","Exterior wash & polish","Tyre shine","Glass polish","Air freshener"],
    process:[{step:1,title:"Interior",desc:"Full interior vacuumed and shampooed."},{step:2,title:"Exterior",desc:"Washed, polished and dried."},{step:3,title:"Detail",desc:"Glass, tyres, chrome detailed."},{step:4,title:"Final",desc:"Air freshener applied, inspection done."}],
    faq:[],
    provider_stats:{jobs_done:540,experience_years:3,satisfaction:96} },

  // Gardening
  { id:"s11g", category_id:"c11", title:"Garden Maintenance", subtitle:"Trimming, watering & care", icon:"🌿",
    image_url:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    gallery:["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"],
    price:800, rating:4.6, review_count:430, duration:"2–3 hrs", is_popular:false,
    description:"Professional gardener for trimming, pruning, planting and general care of your home garden or rooftop.",
    long_description:"Our experienced gardeners bring horticultural knowledge to your garden, rooftop, or balcony. We diagnose plant health, suggest soil improvements, and set up proper watering routines.",
    includes:["Plant trimming & shaping","Dead-heading & pruning","Fertilization & soil check","Watering setup advice","New plant potting","Debris cleanup"],
    process:[{step:1,title:"Assess",desc:"Plant health, soil, and sunlight assessed."},{step:2,title:"Trim & Prune",desc:"All plants shaped and deadwood removed."},{step:3,title:"Treat",desc:"Fertilizer and soil conditioner applied."},{step:4,title:"Clean",desc:"All debris cleared, advice on maintenance given."}],
    faq:[],
    provider_stats:{jobs_done:430,experience_years:4,satisfaction:95} },

  // Laptop
  { id:"s12", category_id:"c12", title:"Laptop Repair & Service", subtitle:"Hardware & software fix", icon:"💻",
    image_url:"/images/pexels-ian-panelo-4494662.jpg",
    gallery:["/images/pexels-artempodrez-8986133.jpg", "/images/pexels-igonkin-14667297.jpg", "/images/pexels-it-services-eu-9278798-7639370.jpg"],
    price:600, rating:4.5, review_count:1300, duration:"1–3 hrs", is_popular:false,
    description:"Certified technician for laptop screen, battery, keyboard, OS issues and performance tuning.",
    long_description:"Our laptop technicians handle it all at your home — from cracked screens to virus-ridden OS. We carry spare parts for all major models.",
    includes:["Full diagnosis report","OS reinstall / clean","Virus & malware removal","Hardware repair (screen, battery, keyboard)","Data backup before repair","Performance tuning"],
    process:[{step:1,title:"Diagnose",desc:"Hardware & software diagnosis report prepared."},{step:2,title:"Backup",desc:"Your data backed up safely before any work."},{step:3,title:"Repair",desc:"Faulty components replaced or software fixed."},{step:4,title:"Test",desc:"Full test run, data restored, performance checked."}],
    faq:[{q:"What brands do you support?",a:"All major brands: Dell, HP, Lenovo, Asus, Apple, Acer."}],
    provider_stats:{jobs_done:1300,experience_years:5,satisfaction:94} },

  // Security
  { id:"s13", category_id:"c13", title:"CCTV Camera Installation", subtitle:"HD cameras + DVR setup", icon:"📷",
    image_url:"/images/pexels-the-ghazi-2152398165-32178067.jpg",
    gallery:[],
    price:3500, rating:4.8, review_count:760, duration:"2–4 hrs", is_popular:true,
    description:"Professional CCTV installation for homes and offices. Includes camera placement, DVR/NVR setup, mobile app configuration, and cable routing.",
    long_description:"Protect your home or office with a professionally installed CCTV system. Our security technicians plan optimal camera positions for maximum coverage and configure remote viewing on your phone.",
    includes:["Site survey & planning","Camera mounting (wall/ceiling)","DVR/NVR setup & config","Mobile app remote access","Cable routing & concealment","1-year installation warranty"],
    process:[{step:1,title:"Survey",desc:"Optimal camera positions identified."},{step:2,title:"Mount",desc:"Cameras mounted securely, cables routed neatly."},{step:3,title:"Configure",desc:"DVR set up, recording schedules programmed."},{step:4,title:"App Setup",desc:"Mobile access configured and tested."}],
    faq:[{q:"How many cameras are included?",a:"Package supports 2, 4, or 8 cameras — choose your plan."},{q:"Can I view remotely?",a:"Yes, we configure remote access on your phone."}],
    provider_stats:{jobs_done:760,experience_years:5,satisfaction:97} },

  { id:"s13b", category_id:"c13", title:"Smart Door Lock Installation", subtitle:"Fingerprint & PIN", icon:"🔐",
    image_url:"/images/pexels-ono-kosuki-5973909.jpg",
    gallery:[],
    price:1800, rating:4.7, review_count:340, duration:"1–2 hrs", is_popular:false,
    description:"Install and configure smart door locks with fingerprint, PIN, or app-based access.",
    long_description:"Upgrade your door security with a smart lock installed by our certified technicians. We handle everything from drilling and mounting to fingerprint enrolment and app pairing.",
    includes:["Lock installation","Fingerprint enrolment (up to 10)","PIN & app setup","Key fob configuration","Demo & training"],
    process:[{step:1,title:"Measure",desc:"Door measured for correct lock fit."},{step:2,title:"Install",desc:"Lock mounted and wired."},{step:3,title:"Program",desc:"Fingerprints, PINs and app paired."},{step:4,title:"Demo",desc:"You\'re shown how to use all features."}],
    faq:[],
    provider_stats:{jobs_done:340,experience_years:3,satisfaction:96} },

  // Moving
  { id:"s14", category_id:"c14", title:"Home Shifting Service", subtitle:"Packing + truck + unboxing", icon:"📦",
    image_url:"/images/pexels-rdne-7464469.jpg",
    gallery:["/images/pexels-artbovich-6436789.jpg", "/images/pexels-artem-makarov-289670876-13151224.jpg", "/images/pexels-darkside-photography-1243587808-36875804.jpg"],
    price:5000, rating:4.5, review_count:890, duration:"Half day", is_popular:true,
    description:"End-to-end home relocation — packing, loading, transport, and unpacking at your new address. Careful handling guaranteed.",
    long_description:"Moving homes is stressful. We make it simple. Our trained team handles every step: packing fragile items, dismantling furniture, transporting carefully, and reassembling everything where you want it.",
    includes:["Packing materials provided","Fragile item wrapping","Furniture dismantling & reassembly","Loading & transport","Unpacking at new address","Basic transit insurance"],
    process:[{step:1,title:"Pre-Move Survey",desc:"We assess all items for planning."},{step:2,title:"Pack",desc:"Every item packed and labeled for a room."},{step:3,title:"Load & Move",desc:"Careful loading, safe transport."},{step:4,title:"Unpack & Setup",desc:"Placed and assembled in your new home."}],
    faq:[{q:"What areas do you cover?",a:"All areas within Dhaka city and Dhaka-Chattogram corridor."},{q:"Is my furniture insured?",a:"Yes, basic transit insurance is included."}],
    provider_stats:{jobs_done:890,experience_years:5,satisfaction:94} },

  { id:"s14b", category_id:"c14", title:"Office Relocation", subtitle:"Desks, servers & equipment", icon:"🏢",
    image_url:"/images/pexels-shantumsingh-29057947.jpg",
    gallery:["/images/pexels-israwmx-28195535.jpg", "/images/pexels-tkirkgoz-14214416.jpg"],
    price:12000, rating:4.6, review_count:210, duration:"Full day", is_popular:false,
    description:"Professional office moving service for SMEs. Handles furniture, IT equipment, server racks, and documents with care.",
    long_description:"Office moves require precision and speed to minimize downtime. Our commercial moving team specializes in IT equipment handling and systematic furniture relocation.",
    includes:["IT equipment packing","Server safe-transport","Furniture dismantling & move","Document box handling","Setup at new office"],
    process:[{step:1,title:"Plan",desc:"Move plan and floor layout agreed upon."},{step:2,title:"IT Pack",desc:"Servers and equipment packed with anti-static protection."},{step:3,title:"Transport",desc:"All items moved in monitored vehicles."},{step:4,title:"Setup",desc:"Office assembled and IT reconnected."}],
    faq:[],
    provider_stats:{jobs_done:210,experience_years:6,satisfaction:95} },

  // Men Grooming
  { id:"s15", category_id:"c15", title:"Haircut at Home (Men)", subtitle:"Salon-style, your doorstep", icon:"💈",
    image_url:"/images/pexels-karola-g2-6078.jpg",
    gallery:["/images/pexels-leonardokfn-7781848.jpg"],
    price:300, rating:4.7, review_count:2890, duration:"30–45 min", is_popular:true, badge:"Men\'s Favourite",
    description:"Professional barber at your doorstep. Includes haircut, beard trim, and hot towel finish.",
    long_description:"Skip the barbershop queue. Our skilled barbers come to you with professional-grade clippers and scissors. Get your preferred style with beard shaping, hot towel treatment, and hair styling.",
    includes:["Haircut (any style)","Beard trim & shape","Hot towel treatment","Hair washing (optional)","Styling with product","Cleanup"],
    process:[{step:1,title:"Style Consult",desc:"Show your reference or describe your style."},{step:2,title:"Wash",desc:"Hair washed and towel dried (optional)."},{step:3,title:"Cut",desc:"Precise haircut with professional tools."},{step:4,title:"Finish",desc:"Beard trimmed, hot towel, styled and set."}],
    faq:[{q:"Do I need to provide anything?",a:"Just a chair and a mirror. We bring all tools and equipment."}],
    provider_stats:{jobs_done:2890,experience_years:4,satisfaction:97} },

  { id:"s15b", category_id:"c15", title:"Shave & Beard Grooming", subtitle:"Classic straight-razor shave", icon:"🪒",
    image_url:"/images/pexels-cottonbro-3998419.jpg",
    gallery:["/images/pexels-cottonbro-4812636.jpg"],
    price:200, rating:4.8, review_count:1560, duration:"20–30 min", is_popular:false,
    description:"Classic hot-towel shave and professional beard grooming by an expert barber at your home.",
    long_description:"A classic hot-towel straight-razor shave is an experience. Our barbers prep your skin with a steaming towel and deliver the smoothest shave, followed by aftershave and moisturizer.",
    includes:["Hot towel skin prep","Straight-razor shave","Beard trim & shape","Aftershave lotion","Moisturizer finish"],
    process:[{step:1,title:"Prep",desc:"Hot towel opens pores for comfortable shave."},{step:2,title:"Shave",desc:"Straight-razor shave with premium cream."},{step:3,title:"Beard",desc:"Beard shaped and trimmed to perfection."},{step:4,title:"Finish",desc:"Aftershave and moisturizer applied."}],
    faq:[],
    provider_stats:{jobs_done:1560,experience_years:3,satisfaction:98} },

  // Water Heater
  { id:"s16", category_id:"c16", title:"Water Heater Repair", subtitle:"Geyser & instant heater", icon:"🌡️",
    image_url:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    gallery:[],
    price:600, rating:4.5, review_count:870, duration:"1–2 hrs", is_popular:false,
    description:"Repair and service for all geyser and instant water heater brands.",
    long_description:"A broken water heater disrupts your whole day. Our technicians diagnose and fix element, thermostat, pressure valve, and wiring issues on-site for all major brands.",
    includes:["Full diagnosis","Element check/replacement","Thermostat check","Safety valve test","Leak fix","Electrical connection check"],
    process:[{step:1,title:"Diagnose",desc:"Technician identifies the fault component."},{step:2,title:"Quote",desc:"Parts and labour cost approved."},{step:3,title:"Repair",desc:"Faulty parts replaced with tested components."},{step:4,title:"Test",desc:"Heater run through full heat cycle."}],
    faq:[],
    provider_stats:{jobs_done:870,experience_years:4,satisfaction:94} },

  { id:"s16b", category_id:"c16", title:"Water Heater Installation", subtitle:"New unit, full setup", icon:"🛁",
    image_url:"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    gallery:[],
    price:900, rating:4.7, review_count:460, duration:"1–2 hrs", is_popular:false,
    description:"Professional installation of any new water heater — geyser, instant, or solar.",
    long_description:"Our technicians handle mounting, plumbing connections, electrical wiring, and safety testing for all geyser types.",
    includes:["Unit wall mounting","Plumbing connection","Electrical wiring","Safety test run","Safety briefing"],
    process:[{step:1,title:"Site Check",desc:"Location assessed for safe mounting."},{step:2,title:"Mount",desc:"Heater mounted securely on wall."},{step:3,title:"Connect",desc:"Plumbing and electrical connections made."},{step:4,title:"Test",desc:"Full test cycle and safety briefing."}],
    faq:[],
    provider_stats:{jobs_done:460,experience_years:3,satisfaction:96} },

  // Home Care (c17) - NEW
  { id:"s41", category_id:"c17", title:"Babysitting Service", subtitle:"Trusted, trained caregivers", icon:"👶",
    image_url:"/images/pexels-alameenng-33262773.jpg",
    gallery:["/images/pexels-alinadegli-20850801.jpg", "/images/pexels-cottonbro-5871915.jpg", "/images/pexels-cripsdog-30809943.jpg"],
    price:500, rating:4.9, review_count:1420, duration:"Per session", is_popular:true, badge:"Parent\'s Choice",
    description:"Experienced, background-verified babysitters for infants to age 12. Evening, weekend, and overnight slots available.",
    long_description:"Every Servico babysitter is background-verified, first-aid trained, and has a minimum of 2 years of professional childcare experience. Our caregivers engage children with age-appropriate activities while keeping them safe, fed, and happy.",
    includes:["Background-verified caregiver","First-aid trained","Age-appropriate activities","Meal preparation for child","Regular parent updates","Overnight slots available"],
    process:[{step:1,title:"Match",desc:"Caregiver matched by age of child and preferences."},{step:2,title:"Intro Call",desc:"Meet your babysitter before the session."},{step:3,title:"Care",desc:"Child supervised, engaged and cared for."},{step:4,title:"Update",desc:"Session summary and photos sent to parent."}],
    faq:[{q:"Are babysitters background checked?",a:"Yes, police verification and reference checks for all caregivers."},{q:"Can I book overnight?",a:"Yes, overnight slots are available with 24hr advance booking."}],
    provider_stats:{jobs_done:1420,experience_years:5,satisfaction:99} },

  { id:"s42", category_id:"c17", title:"Elderly Care at Home", subtitle:"Compassionate daily assistance", icon:"👴",
    image_url:"/images/pexels-halosa-sapa-701665231-18120174.jpg",
    gallery:["/images/pexels-gustavo-fring-3985325.jpg", "/images/pexels-jan-brndiar-809427026-27697878.jpg", "/images/pexels-thirdman-7659872.jpg"],
    price:800, rating:4.9, review_count:870, duration:"Per session", is_popular:true,
    description:"Compassionate elderly care assistants for daily living activities, medication reminders, and companionship.",
    long_description:"Our trained elderly care assistants provide dignified, compassionate support for daily living — from bathing assistance to medication reminders, mobility support, and meaningful companionship.",
    includes:["Personal hygiene assistance","Medication reminders","Mobility & walking support","Meal preparation","Companionship & mental engagement","Regular family updates"],
    process:[{step:1,title:"Assessment",desc:"Care needs and routine assessed with family."},{step:2,title:"Care Plan",desc:"Personalised daily care schedule created."},{step:3,title:"Daily Care",desc:"Caregiver arrives and follows the care plan."},{step:4,title:"Reporting",desc:"Daily updates and health notes shared with family."}],
    faq:[{q:"Are caregivers trained?",a:"Yes, trained in elderly care, first aid, and dementia awareness."},{q:"Can I book full-day care?",a:"Yes, half-day (4hr), full-day (8hr), and live-in options available."}],
    provider_stats:{jobs_done:870,experience_years:6,satisfaction:99} },

  { id:"s43", category_id:"c17", title:"Home Cooking Service", subtitle:"Fresh meals, your recipes", icon:"🍳",
    image_url:"/images/pexels-marina-abrosimova-3319804-5563665.jpg",
    gallery:["/images/pexels-maksgelatin-4351726.jpg", "/images/pexels-nicobecker-5619449.jpg"],
    price:600, rating:4.8, review_count:990, duration:"2–3 hrs", is_popular:false,
    description:"Experienced home chef cooks fresh, hygienic meals in your kitchen — breakfast, lunch, or dinner.",
    long_description:"Our experienced home chefs follow your recipes or suggest their own specialties. Great for working families, elderly households, or anyone wanting healthy home-cooked meals.",
    includes:["Grocery shopping optional","3–4 dishes per session","Uses your kitchen & ingredients","Cooking & serving","Kitchen cleanup after cooking"],
    process:[{step:1,title:"Menu Plan",desc:"Menu agreed in advance via chat."},{step:2,title:"Shop",desc:"Chef shops for fresh ingredients (optional)."},{step:3,title:"Cook",desc:"Full meal prepared fresh in your kitchen."},{step:4,title:"Cleanup",desc:"Kitchen left clean and tidy."}],
    faq:[{q:"Do I need to buy groceries?",a:"We can shop for you (cost reimbursed) or you can provide ingredients."}],
    provider_stats:{jobs_done:990,experience_years:4,satisfaction:97} },

  { id:"s44", category_id:"c17", title:"House Maid Service", subtitle:"Reliable daily/weekly help", icon:"🏠",
    image_url:"/images/pexels-liliana-drew-9462344.jpg",
    gallery:["/images/pexels-liliana-drew-9462651.jpg", "/images/pexels-liliana-drew-9462766.jpg", "/images/pexels-tima-miroshnichenko-6197116.jpg"],
    price:400, rating:4.6, review_count:2100, duration:"Per session", is_popular:false,
    description:"Background-verified house help for daily cleaning, cooking assistance, and general household tasks.",
    long_description:"Trained and verified house helpers available daily, 3x/week, or weekly. They handle sweeping, mopping, dishwashing, laundry, and light cooking.",
    includes:["Floor sweeping & mopping","Dishwashing","Laundry (wash & fold)","Dusting & tidying","Light cooking assistance"],
    process:[{step:1,title:"Match",desc:"Helper matched to your area and requirements."},{step:2,title:"Schedule",desc:"Days and hours agreed."},{step:3,title:"Work",desc:"Helper arrives and completes assigned tasks."},{step:4,title:"Feedback",desc:"Rate after each session."}],
    faq:[{q:"Are helpers verified?",a:"Yes, police clearance and reference checks for all."}],
    provider_stats:{jobs_done:2100,experience_years:4,satisfaction:95} },

  { id:"s45", category_id:"c17", title:"Laundry Service", subtitle:"Wash, dry & fold", icon:"👕",
    image_url:"/images/pexels-annushka-ahuja-8113779.jpg",
    gallery:["/images/pexels-israyosoy-20196996.jpg", "/images/pexels-karola-g-5202923.jpg", "/images/pexels-rdne-5591649.jpg"],
    price:300, rating:4.5, review_count:1800, duration:"Same day", is_popular:false,
    description:"Pickup, wash, dry, fold and return your laundry — all within 24 hours.",
    long_description:"We pick up your clothes, wash with the right cycle for each fabric, dry, fold neatly, and return within 24 hours. Delicate item handling and stain treatment available.",
    includes:["Pickup from your door","Fabric-appropriate wash cycle","Machine & hand wash options","Neat folding","Same-day return available"],
    process:[{step:1,title:"Pickup",desc:"Clothes picked up in provided laundry bag."},{step:2,title:"Sort",desc:"Sorted by color, fabric, and wash type."},{step:3,title:"Wash & Dry",desc:"Washed and dried per garment instructions."},{step:4,title:"Fold & Return",desc:"Folded neatly and returned to your door."}],
    faq:[],
    provider_stats:{jobs_done:1800,experience_years:3,satisfaction:94} },

  { id:"s46", category_id:"c17", title:"Clothes Ironing", subtitle:"Crisp & wrinkle-free", icon:"👔",
    image_url:"/images/pexels-cottonbro-4155019.jpg",
    gallery:["/images/pexels-jonathanborba-28576617.jpg", "/images/pexels-jonathanborba-28576628.jpg"],
    price:150, rating:4.4, review_count:1200, duration:"Per batch", is_popular:false,
    description:"Professional ironing service at your home or as a pickup. Priced per piece.",
    long_description:"Perfectly ironed clothes every time. Our ironing professionals handle all fabric types using the correct heat settings.",
    includes:["All fabric types","Steam ironing","Hanger or folded as preferred","Pickup option available"],
    process:[{step:1,title:"Sort",desc:"Garments sorted by fabric type."},{step:2,title:"Iron",desc:"Each piece ironed with correct heat and steam."},{step:3,title:"Hang/Fold",desc:"Returned on hangers or neatly folded."}],
    faq:[],
    provider_stats:{jobs_done:1200,experience_years:2,satisfaction:92} },

  { id:"s49", category_id:"c17", title:"Home Nurse Service", subtitle:"Post-op & recovery care", icon:"🏥",
    image_url:"/images/pexels-drmkhawarnazir-8815800.jpg",
    gallery:["/images/pexels-pavel-danilyuk-5808019.jpg", "/images/pexels-ron-lach-8817851.jpg", "/images/pexels-thefullonmonet-28380001.jpg"],
    price:1200, rating:4.9, review_count:540, duration:"Per shift", is_popular:false,
    description:"Registered nurses for post-surgery recovery, IV management, wound care, and daily patient monitoring.",
    long_description:"Professional nursing care at home for patients recovering from surgery or managing chronic illness. All nurses are registered with BNMC and carry full medical kits.",
    includes:["Vital signs monitoring","Wound dressing & care","IV management","Medication administration","Patient hygiene assistance","Daily health report"],
    process:[{step:1,title:"Assessment",desc:"Nurse reviews patient history and care plan."},{step:2,title:"Daily Care",desc:"Vitals, medication, and procedures performed."},{step:3,title:"Monitor",desc:"Continuous observation and documentation."},{step:4,title:"Report",desc:"Daily health summary shared with family/doctor."}],
    faq:[{q:"Are nurses registered?",a:"Yes, all nurses are BNMC registered with valid licenses."}],
    provider_stats:{jobs_done:540,experience_years:6,satisfaction:99} },

  // Logistics (c18) - NEW
  { id:"s51", category_id:"c18", title:"Grocery Delivery", subtitle:"Fresh groceries to your door", icon:"🛒",
    image_url:"/images/pexels-designeramit733-20922619.jpg",
    gallery:["/images/pexels-gustavo-fring-8770553.jpg", "/images/pexels-js-leng-2834754-4374843.jpg", "/images/pexels-kampus-7551674.jpg"],
    price:100, rating:4.6, review_count:3200, duration:"1–2 hrs", is_popular:true, badge:"Daily Essential",
    description:"Order groceries from your preferred market or supershop and get them delivered within 2 hours.",
    long_description:"Send us your grocery list and we\'ll head to your preferred market, pick the freshest produce, and deliver to your door. No markup on grocery prices — just a flat delivery fee.",
    includes:["Flat delivery fee","Fresh produce priority","Market or supershop of your choice","Real-time updates","Same-day delivery"],
    process:[{step:1,title:"List",desc:"Share your grocery list via chat."},{step:2,title:"Shop",desc:"Shopper heads to your chosen market."},{step:3,title:"Update",desc:"Photos of items sent before checkout."},{step:4,title:"Deliver",desc:"Groceries delivered and bill settled."}],
    faq:[],
    provider_stats:{jobs_done:3200,experience_years:3,satisfaction:95} },

  { id:"s52", category_id:"c18", title:"Courier Service", subtitle:"Same-city parcel pickup & drop", icon:"📦",
    image_url:"/images/pexels-ayyeee-ayyeee-434363205-37177072.jpg",
    gallery:["/images/pexels-ayyeee-ayyeee-434363205-37177070.jpg", "/images/pexels-blue-bird-7217903.jpg", "/images/pexels-bulat843-1243575272-29922283.jpg"],
    price:80, rating:4.5, review_count:2800, duration:"Same day", is_popular:false,
    description:"Fast same-city parcel pickup and delivery within Dhaka. Express options available.",
    long_description:"Need to send something across Dhaka today? Our courier riders pick up from your door and deliver the same day with live tracking included.",
    includes:["Door-to-door pickup","Live tracking","Proof of delivery","Express option (2 hr)","Up to 5kg standard"],
    process:[{step:1,title:"Book",desc:"Enter pickup and delivery addresses."},{step:2,title:"Pickup",desc:"Rider picks up parcel from your door."},{step:3,title:"Transit",desc:"Live tracking active throughout delivery."},{step:4,title:"Deliver",desc:"Delivered with photo confirmation."}],
    faq:[],
    provider_stats:{jobs_done:2800,experience_years:4,satisfaction:94} },

  { id:"s53", category_id:"c18", title:"Furniture Moving", subtitle:"Within your home or building", icon:"🛋️",
    image_url:"/images/pexels-rdne-7363192.jpg",
    gallery:["/images/pexels-clement-proust-363898785-31771167.jpg"],
    price:600, rating:4.4, review_count:680, duration:"1–3 hrs", is_popular:false,
    description:"Move heavy furniture within your home, to another floor, or across the building safely.",
    long_description:"Our trained movers handle even the heaviest sofas, beds, wardrobes, and cabinets — without scratching your floors or walls.",
    includes:["Up to 10 items","Floor protection pads","Disassembly if needed","Safe stairway navigation","Reassembly at new spot"],
    process:[{step:1,title:"Plan",desc:"Route and placement planned to avoid damage."},{step:2,title:"Protect",desc:"Floor pads and furniture wraps applied."},{step:3,title:"Move",desc:"Items carefully moved to new location."},{step:4,title:"Place",desc:"Positioned exactly where you want them."}],
    faq:[],
    provider_stats:{jobs_done:680,experience_years:3,satisfaction:93} },

  // Beauty & Personal Care (c19) - NEW
  { id:"s61", category_id:"c19", title:"Haircut (Women)", subtitle:"Trim, layers & styling", icon:"✂️",
    image_url:"/images/pexels-karola-g-4239141.jpg",
    gallery:["/images/pexels-jari-lobo-456989711-15659507.jpg", "/images/pexels-karola-g-4239074.jpg", "/images/pexels-kieutruongphoto-15554492.jpg"],
    price:400, rating:4.8, review_count:1650, duration:"45–60 min", is_popular:true, badge:"Trending",
    description:"Professional women\'s haircut at home — trimming, layering, and blowdry styling by experienced stylists.",
    long_description:"Our female stylists are trained in all hair types and can execute any style from a classic trim to dimensional layers and blowdry finishes.",
    includes:["Consultation & style reference","Wash & condition","Precision cut","Blowdry & style","Finishing product"],
    process:[{step:1,title:"Consult",desc:"Show reference or describe desired style."},{step:2,title:"Wash",desc:"Hair shampooed and conditioned."},{step:3,title:"Cut",desc:"Precision cut tailored to your face shape."},{step:4,title:"Style",desc:"Blowdried and styled to perfection."}],
    faq:[{q:"Do they bring their own tools?",a:"Yes, all scissors, combs, and blow dryers are provided by the stylist."}],
    provider_stats:{jobs_done:1650,experience_years:5,satisfaction:98} },

  { id:"s62", category_id:"c19", title:"Hair Coloring", subtitle:"Root touch-up & full color", icon:"🎨",
    image_url:"/images/pexels-karola-g-7320112.jpg",
    gallery:["/images/pexels-karola-g-7321548.jpg", "/images/pexels-skgphotography-29354307.jpg", "/images/pexels-skgphotography-29368882.jpg"],
    price:1500, rating:4.7, review_count:920, duration:"2–3 hrs", is_popular:false,
    description:"Professional hair coloring at home — single shade, highlights, balayage, and root touch-ups.",
    long_description:"Our colorists use premium, low-ammonia color products to deliver rich, even color with minimal damage. Services include root touch-up, all-over color, highlights, and balayage.",
    includes:["Color consultation","Strand test","Color application","Processing time","Toner (if needed)","Conditioning treatment","Blowdry"],
    process:[{step:1,title:"Consult",desc:"Desired color and technique discussed."},{step:2,title:"Test",desc:"Strand test done for allergies and result preview."},{step:3,title:"Apply",desc:"Color applied with professional technique."},{step:4,title:"Finish",desc:"Rinsed, conditioned, blowdried."}],
    faq:[],
    provider_stats:{jobs_done:920,experience_years:5,satisfaction:96} },

  { id:"s63", category_id:"c19", title:"Manicure", subtitle:"Nails, cuticles & polish", icon:"💅",
    image_url:"/images/pexels-cottonbro-4107274.jpg",
    gallery:["/images/pexels-cottonbro-3993449.jpg", "/images/pexels-n-voitkevich-8468036.jpg", "/images/pexels-n-voitkevich-8468126.jpg"],
    price:350, rating:4.7, review_count:1340, duration:"45 min", is_popular:false,
    description:"Full manicure including nail shaping, cuticle care, hand massage, and your choice of nail polish.",
    long_description:"Beautiful, well-groomed nails from the comfort of your home. Our nail technicians bring a complete sterilized manicure kit and a range of polishes.",
    includes:["Nail shaping & filing","Cuticle softening & care","Hand soak & exfoliation","Hand massage","Polish of your choice","Top coat"],
    process:[{step:1,title:"Soak",desc:"Hands soaked to soften cuticles."},{step:2,title:"Shape",desc:"Nails filed and cuticles cleaned."},{step:3,title:"Massage",desc:"Hand and wrist massage with lotion."},{step:4,title:"Polish",desc:"Base, color, and top coat applied."}],
    faq:[],
    provider_stats:{jobs_done:1340,experience_years:3,satisfaction:97} },

  { id:"s64", category_id:"c19", title:"Pedicure", subtitle:"Feet soak, scrub & polish", icon:"🦶",
    image_url:"/images/pexels-baixi-liu-682295262-18866923.jpg",
    gallery:["/images/pexels-cottonbro-4107284.jpg", "/images/pexels-n-voitkevich-8468127.jpg"],
    price:400, rating:4.7, review_count:1100, duration:"60 min", is_popular:false,
    description:"Relaxing pedicure with foot soak, callus removal, nail care, and polishing.",
    long_description:"Give your feet the care they deserve with warm foot soak, callus removal, nail trimming, cuticle care, foot massage, and polish — all with a sterilized, hygiene-first approach.",
    includes:["Warm foot soak","Callus & dead skin removal","Nail trim & shape","Cuticle care","Foot & leg massage","Polish of your choice"],
    process:[{step:1,title:"Soak",desc:"Feet soaked in warm water with salts."},{step:2,title:"Exfoliate",desc:"Callus and dead skin removed gently."},{step:3,title:"Nail Care",desc:"Nails trimmed, shaped, cuticles done."},{step:4,title:"Massage & Polish",desc:"Foot massage followed by polish."}],
    faq:[],
    provider_stats:{jobs_done:1100,experience_years:3,satisfaction:97} },

  { id:"s65", category_id:"c19", title:"Nail Art", subtitle:"Gel, acrylic & nail designs", icon:"🎨",
    image_url:"/images/pexels-cottonbro-7582554.jpg",
    gallery:["/images/pexels-cottonbro-7582560.jpg", "/images/pexels-cottonbro-7582591.jpg", "/images/pexels-svliiim-34835303.jpg"],
    price:700, rating:4.8, review_count:830, duration:"90 min", is_popular:false,
    description:"Custom nail art designs — gel, acrylic, French tip, ombre, and hand-painted art at your home.",
    long_description:"From minimalist French tips to intricate hand-painted designs, gel extensions to ombre fades — we bring the nail salon to you.",
    includes:["Nail prep & base","Custom design consultation","Gel or acrylic option","Hand-painted art","Top coat & UV cure","Aftercare tips"],
    process:[{step:1,title:"Design",desc:"Reference images or custom design agreed."},{step:2,title:"Prep",desc:"Nails cleaned, filed and primed."},{step:3,title:"Apply",desc:"Base, design, and gel applied layer by layer."},{step:4,title:"Cure & Finish",desc:"UV cured, top coat, final check."}],
    faq:[],
    provider_stats:{jobs_done:830,experience_years:4,satisfaction:98} },

  { id:"s66", category_id:"c19", title:"Waxing", subtitle:"Arms, legs, underarms & more", icon:"✨",
    image_url:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    gallery:[],
    price:400, rating:4.6, review_count:1500, duration:"30–60 min", is_popular:false,
    description:"Professional waxing for all body areas using hygienic, single-use strips and quality wax.",
    long_description:"Our trained beauty therapists use high-quality wax and strictly hygienic, single-use strips for a thorough and comfortable waxing experience.",
    includes:["Arms & legs (full)","Underarms","Upper lip & chin","Single-use strips","Soothing post-wax gel"],
    process:[{step:1,title:"Prep",desc:"Skin prepped with pre-wax cleanser."},{step:2,title:"Wax",desc:"Wax applied and removed in correct direction."},{step:3,title:"Soothe",desc:"Soothing gel applied to reduce redness."},{step:4,title:"Aftercare",desc:"Aftercare advice shared."}],
    faq:[],
    provider_stats:{jobs_done:1500,experience_years:3,satisfaction:95} },

  { id:"s67", category_id:"c19", title:"Threading", subtitle:"Eyebrow, upper lip & face", icon:"🧵",
    image_url:"/images/pexels-kseniachernaya-5691503.jpg",
    gallery:["/images/pexels-kseniachernaya-5691553.jpg"],
    price:150, rating:4.7, review_count:2200, duration:"15–20 min", is_popular:false,
    description:"Precise eyebrow and facial threading by experienced beauty professionals at your home.",
    long_description:"Threading is the most precise method of facial hair removal. Our professionals shape your eyebrows to perfection and remove unwanted facial hair.",
    includes:["Eyebrow shaping","Upper lip threading","Chin & forehead optional","Soothing gel after"],
    process:[{step:1,title:"Consult",desc:"Desired eyebrow shape discussed."},{step:2,title:"Thread",desc:"Precise threading with quality thread."},{step:3,title:"Shape",desc:"Both brows checked and matched."},{step:4,title:"Soothe",desc:"Calming gel applied after."}],
    faq:[],
    provider_stats:{jobs_done:2200,experience_years:3,satisfaction:97} },

  { id:"s68", category_id:"c19", title:"Party Makeup", subtitle:"Event-ready glam at home", icon:"💄",
    image_url:"/images/pexels-fahadputhawala-33945853.jpg",
    gallery:["/images/pexels-fahadputhawala-34025144.jpg", "/images/pexels-gstudio-27215781.jpg", "/images/pexels-sie7e-29189916.jpg"],
    price:1800, rating:4.8, review_count:740, duration:"60–90 min", is_popular:false,
    description:"Full party or event makeup by professional artists. HD, airbrush, or traditional application.",
    long_description:"Look stunning for any occasion — Eid celebrations, weddings, graduations, or parties. Our makeup artists create flawless, long-wear looks tailored to your outfit and skin tone.",
    includes:["Skin prep & primer","Foundation & contouring","Eye makeup (shadow, liner, lash)","Lip color","Setting spray for long wear"],
    process:[{step:1,title:"Consult",desc:"Look inspiration and event discussed."},{step:2,title:"Prep",desc:"Skin primed for longevity."},{step:3,title:"Makeup",desc:"Full look applied step by step."},{step:4,title:"Set",desc:"Setting spray for all-night wear."}],
    faq:[],
    provider_stats:{jobs_done:740,experience_years:4,satisfaction:98} },

  // Fitness & Wellness (c20) - NEW
  { id:"s71", category_id:"c20", title:"Personal Fitness Trainer", subtitle:"Home workout sessions", icon:"💪",
    image_url:"/images/pexels-mehmet-altintas-392989477-19955934.jpg",
    gallery:["/images/pexels-fatihyurtman-17842834.jpg", "/images/pexels-mavihnt-36874496.jpg", "/images/pexels-ranjeet-860714737-27928762.jpg"],
    price:700, rating:4.9, review_count:1120, duration:"60 min", is_popular:true, badge:"Health First",
    description:"Certified personal trainer for weight loss, muscle building, or general fitness — all at your home.",
    long_description:"Our certified trainers design personalized workout plans based on your goals, fitness level, and available equipment. Every session is tracked for progress.",
    includes:["Fitness assessment","Personalized workout plan","60-min training session","Nutritional guidance","Progress tracking","Home equipment recommendations"],
    process:[{step:1,title:"Assessment",desc:"Fitness level, goals and limitations assessed."},{step:2,title:"Plan",desc:"Personalised workout program designed."},{step:3,title:"Train",desc:"Guided, motivating 60-min session."},{step:4,title:"Track",desc:"Progress logged and plan adjusted."}],
    faq:[{q:"Do I need equipment?",a:"No. Our trainers design bodyweight programs or bring resistance bands."},{q:"How many sessions per week?",a:"3 sessions per week is optimal for most goals."}],
    provider_stats:{jobs_done:1120,experience_years:5,satisfaction:99} },

  { id:"s72", category_id:"c20", title:"Yoga Trainer at Home", subtitle:"Morning & evening sessions", icon:"🧘",
    image_url:"/images/pexels-josemiguel67bio-31567147.jpg",
    gallery:["/images/pexels-fatih-guney-337108406-19189144.jpg", "/images/pexels-jsme-mila-523821574-18429309.jpg", "/images/pexels-ketut-subiyanto-4246106.jpg"],
    price:600, rating:4.9, review_count:870, duration:"60 min", is_popular:true,
    description:"Certified yoga instructors for beginner, intermediate, and advanced sessions — morning or evening.",
    long_description:"Experience the benefits of yoga — flexibility, stress relief, better sleep — guided by certified instructors at your home. Every session tailored to your level.",
    includes:["All levels welcome","Personalized flow design","Breathwork & meditation","Yoga mat provided","Relaxation & cool-down","Morning or evening slots"],
    process:[{step:1,title:"Consult",desc:"Goals, level, and any injuries discussed."},{step:2,title:"Warm-Up",desc:"Gentle warm-up and breathwork."},{step:3,title:"Flow",desc:"Tailored yoga sequence guided carefully."},{step:4,title:"Rest",desc:"Savasana, meditation, and cool-down."}],
    faq:[{q:"Do I need my own mat?",a:"No, our instructor brings a clean mat for you."},{q:"Is it suitable for beginners?",a:"Absolutely, we welcome all levels from day one."}],
    provider_stats:{jobs_done:870,experience_years:6,satisfaction:99} },

  { id:"s73", category_id:"c20", title:"Body Massage at Home", subtitle:"Swedish & aromatherapy", icon:"💆",
    image_url:"/images/pexels-arina-krasnikova-6663374.jpg",
    gallery:["/images/pexels-alexandre-saraiva-carniato-583650-6188365.jpg", "/images/pexels-jonathanborba-19695945.jpg", "/images/pexels-ketut-subiyanto-4246092.jpg"],
    price:1000, rating:4.8, review_count:760, duration:"60–90 min", is_popular:false,
    description:"Relaxing body massage by certified therapists. Swedish, deep tissue, or aromatherapy oil massage.",
    long_description:"Release tension and restore calm with a professional massage at your home. Our certified therapists use premium oils and expert technique.",
    includes:["Technique consultation","Premium massage oil","Full or targeted body massage","Hot towel application","Aftercare stretch guide"],
    process:[{step:1,title:"Setup",desc:"Table set up in a comfortable private space."},{step:2,title:"Consult",desc:"Problem areas and pressure preference discussed."},{step:3,title:"Massage",desc:"Professional session tailored to your needs."},{step:4,title:"Finish",desc:"Hot towel, recovery tips, hydration advised."}],
    faq:[],
    provider_stats:{jobs_done:760,experience_years:5,satisfaction:98} },

  { id:"s74", category_id:"c20", title:"Spa Therapy at Home", subtitle:"Full spa package, your comfort", icon:"🛁",
    image_url:"/images/pexels-polina-kovaleva-6619475.jpg",
    gallery:["/images/pexels-anntarazevich-5308670.jpg", "/images/pexels-leeloothefirst-4677846.jpg", "/images/pexels-ron-lach-8140913.jpg"],
    price:2500, rating:4.9, review_count:430, duration:"2–3 hrs", is_popular:false,
    description:"Complete spa experience at home — massage, facial, scrub, and aromatherapy all in one package.",
    long_description:"Our comprehensive home spa package includes a relaxing body massage, facial treatment, full-body scrub, and aromatherapy — creating a complete restorative experience in your own space.",
    includes:["Full body massage (60 min)","Facial cleanup & mask","Body scrub & exfoliation","Aromatherapy oils","Hot & cold compress","Herbal tea & relaxation package"],
    process:[{step:1,title:"Arrival & Setup",desc:"Ambience set — lighting, oils, and music arranged."},{step:2,title:"Scrub",desc:"Body scrub to exfoliate and refresh skin."},{step:3,title:"Massage & Facial",desc:"Massage and facial treatment performed."},{step:4,title:"Cool Down",desc:"Aromatherapy finish and relaxation time."}],
    faq:[],
    provider_stats:{jobs_done:430,experience_years:6,satisfaction:99} },
];

const REVIEWS = {
  s1: [
    { id:"r1", author:"Rahim U.", avatar:"R", rating:5, comment:"AC works like new after the service. The technician was very professional and explained everything he was doing. Highly recommend!", created_at:"2025-03-10" },
    { id:"r2", author:"Nadia K.", avatar:"N", rating:4, comment:"Came exactly on time, did a thorough job. AC is cooling much better now. Will definitely book again.", created_at:"2025-02-28" },
    { id:"r3", author:"Shahidul M.", avatar:"S", rating:5, comment:"Best AC service I\'ve had. They cleaned parts I didn\'t even know needed cleaning. My electricity bill actually went down!", created_at:"2025-04-15" },
  ],
  s2: [
    { id:"r4", author:"Ayesha T.", avatar:"A", rating:5, comment:"My apartment has never been this clean! The team of 3 worked so efficiently. Every corner was spotless.", created_at:"2025-04-01" },
    { id:"r5", author:"Karim H.", avatar:"K", rating:5, comment:"Excellent team, very detail-oriented. They cleaned things I forgot even existed. Worth every taka.", created_at:"2025-03-22" },
    { id:"r6", author:"Sadia B.", avatar:"S", rating:4, comment:"Good service overall. Kitchen and bathrooms were immaculate. Took about 4 hours for a 3-bedroom apartment.", created_at:"2025-04-10" },
  ],
  s3: [
    { id:"r7", author:"Fatima A.", avatar:"F", rating:5, comment:"Absolutely loved the facial! The beautician was skilled and used great products. My skin felt amazing after.", created_at:"2025-04-05" },
    { id:"r8", author:"Mithila R.", avatar:"M", rating:5, comment:"So convenient and professional. Better than my regular salon honestly. Will be booking monthly!", created_at:"2025-03-18" },
  ],
  s13: [
    { id:"r9", author:"Jahangir P.", avatar:"J", rating:5, comment:"Fast installation, app works perfectly. Can see cameras from office. Very professional team.", created_at:"2025-04-10" },
    { id:"r10", author:"Tanvir M.", avatar:"T", rating:4, comment:"Good service, cameras are very clear HD quality. Setup took 3 hours but done properly.", created_at:"2025-03-15" },
  ],
  s14: [
    { id:"r11", author:"Anisur R.", avatar:"A", rating:5, comment:"Zero damage to furniture, very professional team. They packed everything so carefully. Made the move stress-free!", created_at:"2025-04-05" },
    { id:"r12", author:"Rubina K.", avatar:"R", rating:5, comment:"Amazing service. They even assembled all furniture at the new place. Couldn\'t ask for more.", created_at:"2025-03-20" },
  ],
  s15: [
    { id:"r13", author:"Imran H.", avatar:"I", rating:5, comment:"Best haircut I\'ve had in a while. So convenient! Barber was extremely skilled.", created_at:"2025-04-12" },
    { id:"r14", author:"Farhan A.", avatar:"F", rating:5, comment:"Barber was skilled and quick. Hot towel shave was a bonus. Booking again next week!", created_at:"2025-03-28" },
  ],
  s41: [
    { id:"r15", author:"Sabrina M.", avatar:"S", rating:5, comment:"The babysitter was wonderful with my 2-year-old. Very patient and engaging. Felt completely at ease leaving them together.", created_at:"2025-04-08" },
    { id:"r16", author:"Rashed K.", avatar:"R", rating:5, comment:"Background verified and very professional. Our kids loved her. Will definitely use again.", created_at:"2025-03-25" },
  ],
  s42: [
    { id:"r17", author:"Nasreen B.", avatar:"N", rating:5, comment:"The caregiver for my father is exceptional. Very gentle, respectful and professional. He looks forward to her visits.", created_at:"2025-04-02" },
  ],
  s71: [
    { id:"r18", author:"Mizanur R.", avatar:"M", rating:5, comment:"Lost 8kg in 2 months with home training sessions. Trainer kept me motivated and accountable. Life-changing!", created_at:"2025-04-09" },
    { id:"r19", author:"Tahmina S.", avatar:"T", rating:5, comment:"So much better than going to the gym. Personalized attention and workout plan tailored exactly to my needs.", created_at:"2025-03-30" },
  ],
  s72: [
    { id:"r20", author:"Dilruba A.", avatar:"D", rating:5, comment:"My morning yoga sessions are the best part of my day now. Instructor is incredibly calming and knowledgeable.", created_at:"2025-04-11" },
    { id:"r21", author:"Nasim U.", avatar:"N", rating:5, comment:"Perfect for beginners. Patient, encouraging, and the morning sessions energize me for the whole day.", created_at:"2025-04-01" },
  ],
};

const PROVIDER_APPLICATIONS = [
  { id:"pa1", userId:"p1", full_name:"Karim Hossain", phone:"01711-111111", nid:"1234567890", address:"Mirpur, Dhaka", experience_years:5, skills:["AC Repair","Electrical"], bio:"Certified AC technician with 5 years experience.", availability:"Full-time", status:"pending", applied_at:"2025-04-10" },
  { id:"pa2", userId:"p2", full_name:"Fatima Begum", phone:"01722-222222", nid:"2345678901", address:"Uttara, Dhaka", experience_years:3, skills:["Beauty & Spa","Facial"], bio:"Professional beautician specialized in bridal makeup.", availability:"Weekends", status:"pending", applied_at:"2025-04-08" },
  { id:"pa3", userId:"p3", full_name:"Rafiq Uddin", phone:"01733-333333", nid:"3456789012", address:"Banani, Dhaka", experience_years:7, skills:["Plumbing","Electrical"], bio:"Master plumber with 7 years of experience in residential and commercial projects.", availability:"Full-time", status:"approved", applied_at:"2025-04-05" },
  { id:"pa4", userId:"p4", full_name:"Shahana Parvin", phone:"01744-444444", nid:"4567890123", address:"Dhanmondi, Dhaka", experience_years:2, skills:["Home Cleaning"], bio:"Hardworking cleaning professional.", availability:"Part-time", status:"rejected", applied_at:"2025-04-03" },
  { id:"pa5", userId:"p5", full_name:"Mahbub Alam", phone:"01755-555555", nid:"5678901234", address:"Mohammadpur, Dhaka", experience_years:4, skills:["Carpentry","Painting"], bio:"Skilled carpenter and painter.", availability:"Full-time", status:"pending", applied_at:"2025-04-01" },
  { id:"pa6", userId:"p6", full_name:"Nusrat Jahan", phone:"01766-666666", nid:"6789012345", address:"Gulshan, Dhaka", experience_years:6, skills:["Yoga","Fitness Training"], bio:"Certified yoga instructor.", availability:"Morning slots", status:"suspended", applied_at:"2025-03-28" },
];

const MOCK_USERS = [
  { id:"u1", name:"Rahim Uddin", email:"rahim@email.com", phone:"01711-111111", joined_at:"2024-06-15", total_bookings:12, status:"active" },
  { id:"u2", name:"Nadia Karim", email:"nadia@email.com", phone:"01722-222222", joined_at:"2024-07-20", total_bookings:8, status:"active" },
  { id:"u3", name:"Shahidul Islam", email:"shahidul@email.com", phone:"01733-333333", joined_at:"2024-08-10", total_bookings:5, status:"suspended" },
  { id:"u4", name:"Ayesha Tarin", email:"ayesha@email.com", phone:"01744-444444", joined_at:"2024-09-05", total_bookings:15, status:"active" },
  { id:"u5", name:"Tanvir Hasan", email:"tanvir@email.com", phone:"01755-555555", joined_at:"2024-10-01", total_bookings:3, status:"active" },
  { id:"u6", name:"Sabrina Mamun", email:"sabrina@email.com", phone:"01766-666666", joined_at:"2024-11-12", total_bookings:7, status:"suspended" },
];

const MOCK_REVIEWS = [
  { id:"mr1", service_title:"AC General Servicing", customer_name:"Rahim U.", rating:5, text:"AC works like new after the service. Very professional!", date:"2025-04-10", status:"published" },
  { id:"mr2", service_title:"Home Deep Cleaning", customer_name:"Nadia K.", rating:4, text:"Apartment is spotless! Team was very thorough.", date:"2025-04-08", status:"published" },
  { id:"mr3", service_title:"Facial & Cleanup", customer_name:"Fatima A.", rating:5, text:"Loved the facial! My skin feels amazing.", date:"2025-04-05", status:"published" },
  { id:"mr4", service_title:"Plumbing Repair", customer_name:"Karim H.", rating:3, text:"Fixed the leak but took longer than expected.", date:"2025-04-03", status:"hidden" },
  { id:"mr5", service_title:"CCTV Camera Installation", customer_name:"Jahangir P.", rating:5, text:"Fast installation, app works perfectly.", date:"2025-04-01", status:"published" },
  { id:"mr6", service_title:"Home Shifting Service", customer_name:"Anisur R.", rating:4, text:"Zero damage to furniture. Very careful team.", date:"2025-03-30", status:"published" },
  { id:"mr7", service_title:"Haircut at Home", customer_name:"Imran H.", rating:5, text:"Best haircut I've had in a while. So convenient!", date:"2025-03-28", status:"published" },
  { id:"mr8", service_title:"Personal Fitness Trainer", customer_name:"Mizanur R.", rating:5, text:"Lost 8kg in 2 months. Life-changing!", date:"2025-03-25", status:"hidden" },
];

const MOCK_PAYMENTS = [
  { id:"pay1", booking_id:"b1", customer:"Rahim Uddin", service:"AC General Servicing", amount:800, method:"bKash", status:"paid", date:"2025-04-10" },
  { id:"pay2", booking_id:"b2", customer:"Nadia Karim", service:"Home Deep Cleaning", amount:1200, method:"Cash", status:"paid", date:"2025-04-08" },
  { id:"pay3", booking_id:"b3", customer:"Shahidul Islam", service:"Electrical Wiring", amount:500, method:"Nagad", status:"paid", date:"2025-04-05" },
  { id:"pay4", booking_id:"b4", customer:"Ayesha Tarin", service:"Facial & Cleanup", amount:600, method:"bKash", status:"pending", date:"2025-04-03" },
  { id:"pay5", booking_id:"b5", customer:"Tanvir Hasan", service:"Plumbing Repair", amount:450, method:"Cash", status:"refunded", date:"2025-04-01" },
  { id:"pay6", booking_id:"b6", customer:"Sabrina Mamun", service:"CCTV Installation", amount:3500, method:"Card", status:"paid", date:"2025-03-30" },
  { id:"pay7", booking_id:"b7", customer:"Rahim Uddin", service:"Car Wash", amount:350, method:"bKash", status:"paid", date:"2025-03-28" },
  { id:"pay8", booking_id:"b8", customer:"Nadia Karim", service:"Home Deep Cleaning", amount:1200, method:"Nagad", status:"pending", date:"2025-03-25" },
];

const PROMOS = [
  { code:"WELCOME20", type:"percent", value:20, min_order:0, max_uses:100, used:45, expiry:"2025-12-31", status:"active" },
  { code:"FLAT100", type:"flat", value:100, min_order:500, max_uses:50, used:32, expiry:"2025-06-30", status:"active" },
  { code:"SAVE50", type:"flat", value:50, min_order:300, max_uses:200, used:120, expiry:"2025-09-30", status:"active" },
  { code:"EID25", type:"percent", value:25, min_order:1000, max_uses:30, used:30, expiry:"2025-05-15", status:"inactive" },
  { code:"PRO10", type:"percent", value:10, min_order:0, max_uses:500, used:87, expiry:"2025-08-31", status:"active" },
];

let providerApps = [...PROVIDER_APPLICATIONS];
let mockUsers = [...MOCK_USERS];
let mockReviews = [...MOCK_REVIEWS];
let mockPayments = [...MOCK_PAYMENTS];
let mockPromos = [...PROMOS];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function fetchCategories() { await delay(); return CATEGORIES; }
export async function fetchServices({ popular, categorySlug } = {}) {
  await delay();
  let svcs = [...SERVICES];
  if (categorySlug) { const cat = CATEGORIES.find((c) => c.slug === categorySlug); if (cat) svcs = svcs.filter((s) => s.category_id === cat.id); }
  if (popular) svcs = svcs.filter((s) => s.is_popular);
  return svcs;
}
export async function fetchServiceById(id) { await delay(); return SERVICES.find((s) => s.id === id) ?? null; }
export async function fetchServiceReviews(serviceId) { await delay(); return REVIEWS[serviceId] ?? []; }
export async function validatePromoCode(code) {
  await delay(600);
  const PROMOS = { WELCOME20: { type:"percent", value:20 }, FLAT100: { type:"flat", value:100 }, SAVE50: { type:"flat", value:50 } };
  return PROMOS[code] ? PROMOS[code] : { error:"Invalid or expired promo code" };
}
export async function createBooking(data) {
  await delay(800);
  const bookings = JSON.parse(localStorage.getItem("servico_bookings") || "[]");
  const newBooking = { ...data, id:"b" + Date.now(), created_at: new Date().toISOString(), service: SERVICES.find((s) => s.id === data.service_id) };
  bookings.unshift(newBooking);
  localStorage.setItem("servico_bookings", JSON.stringify(bookings));
  return { error: null, booking: newBooking };
}
export async function fetchUserBookings() { await delay(400); return JSON.parse(localStorage.getItem("servico_bookings") || "[]"); }
export async function submitProviderApplication(data) {
  await delay(800);
  const newApp = {
    id: "pa" + Date.now(),
    ...data,
    experience_years: Number(data.experience_years) || 1,
    skills: data.skills || [],
    status: "pending",
    applied_at: new Date().toISOString().split("T")[0],
  };
  providerApps.unshift(newApp);
  return { error: null, application: newApp };
}
export function getProviderAppByUserId(userId) {
  return providerApps.find((a) => a.userId === userId) ?? null;
}
export async function apiForgotPassword(email) { await delay(600); console.log("Password reset for:", email); return { error: null }; }

// ── Admin mock data functions ──
export async function fetchProviderApplications() { await delay(); return providerApps; }
export async function fetchMockUsers() { await delay(); return mockUsers; }
export async function fetchMockReviews() { await delay(); return mockReviews; }
export async function fetchMockPayments() { await delay(); return mockPayments; }
export async function fetchPromos() { await delay(); return mockPromos; }

export async function updateProviderStatus(id, status) {
  await delay(300);
  const idx = providerApps.findIndex((a) => a.id === id);
  if (idx !== -1) providerApps[idx] = { ...providerApps[idx], status };
  return { error: null };
}

export async function addPromo(data) {
  await delay(300);
  mockPromos.unshift({ ...data, used:0, status:"active" });
  return { error: null };
}

export async function updatePromoStatus(code, status) {
  await delay(200);
  const idx = mockPromos.findIndex((p) => p.code === code);
  if (idx !== -1) mockPromos[idx] = { ...mockPromos[idx], status };
  return { error: null };
}

export async function deletePromo(code) {
  await delay(200);
  mockPromos = mockPromos.filter((p) => p.code !== code);
  return { error: null };
}

export async function updateUserStatus(id, status) {
  await delay(200);
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx !== -1) mockUsers[idx] = { ...mockUsers[idx], status };
  return { error: null };
}

export async function updateReviewStatus(id, status) {
  await delay(200);
  const idx = mockReviews.findIndex((r) => r.id === id);
  if (idx !== -1) mockReviews[idx] = { ...mockReviews[idx], status };
  return { error: null };
}

export async function deleteReview(id) {
  await delay(200);
  mockReviews = mockReviews.filter((r) => r.id !== id);
  return { error: null };
}

export async function updatePaymentStatus(id, status) {
  await delay(200);
  const idx = mockPayments.findIndex((p) => p.id === id);
  if (idx !== -1) mockPayments[idx] = { ...mockPayments[idx], status };
  return { error: null };
}

export { CATEGORIES, SERVICES, PROVIDER_APPLICATIONS, MOCK_USERS, MOCK_REVIEWS, MOCK_PAYMENTS, PROMOS };

// ── Provider-specific mock data ──
const PROVIDER_BOOKINGS = [
  { id:"pb1", booking_id:"b101", service_title:"AC General Servicing", icon:"❄️", customer_name:"Rahim Uddin", customer_initials:"R", date:"2025-05-10", time:"10:00 AM", area:"Mirpur", address:"House 12, Road 4, Mirpur 10", amount:800, status:"pending", is_urgent:false, provider_id:"u2" },
  { id:"pb2", booking_id:"b102", service_title:"Home Deep Cleaning", icon:"🧹", customer_name:"Nadia Karim", customer_initials:"N", date:"2025-05-09", time:"2:00 PM", area:"Uttara", address:"Apt 3B, 45 Road 7, Uttara", amount:1200, status:"accepted", is_urgent:true, provider_id:"u2" },
  { id:"pb3", booking_id:"b103", service_title:"Electrical Wiring", icon:"⚡", customer_name:"Shahidul Islam", customer_initials:"S", date:"2025-05-08", time:"11:00 AM", area:"Banani", address:"Flat 5A, 23 Kemal Ataturk Ave", amount:500, status:"completed", is_urgent:false, provider_id:"u2" },
  { id:"pb4", booking_id:"b104", service_title:"Facial & Cleanup", icon:"💆", customer_name:"Ayesha Tarin", customer_initials:"A", date:"2025-05-12", time:"4:00 PM", area:"Dhanmondi", address:"House 8, Road 2, Dhanmondi", amount:600, status:"pending", is_urgent:false, provider_id:"u2" },
  { id:"pb5", booking_id:"b105", service_title:"Plumbing Repair", icon:"🔧", customer_name:"Tanvir Hasan", customer_initials:"T", date:"2025-05-07", time:"9:00 AM", area:"Mohammadpur", address:"Apt 2C, 15 Road 3", amount:450, status:"completed", is_urgent:false, provider_id:"u2" },
  { id:"pb6", booking_id:"b106", service_title:"Wall Painting", icon:"🎨", customer_name:"Sabrina Mamun", customer_initials:"S", date:"2025-05-13", time:"8:00 AM", area:"Gulshan", address:"House 32, Road 12, Gulshan 2", amount:2500, status:"cancelled", is_urgent:false, provider_id:"u2" },
];

const PROVIDER_REVIEWS_DATA = [
  { id:"pr1", customer_name:"Rahim U.", rating:5, text:"Excellent AC service! Very thorough and professional. Would recommend.", date:"2025-05-05", service_title:"AC General Servicing" },
  { id:"pr2", customer_name:"Nadia K.", rating:4, text:"Great cleaning service. The team was punctual and did a thorough job.", date:"2025-05-03", service_title:"Home Deep Cleaning" },
  { id:"pr3", customer_name:"Shahidul M.", rating:5, text:"Fixed my wiring perfectly. Very knowledgeable and fair pricing.", date:"2025-04-28", service_title:"Electrical Wiring" },
  { id:"pr4", customer_name:"Farzana B.", rating:5, text:"Best service provider on Servico. Highly skilled and professional.", date:"2025-04-20", service_title:"Plumbing Repair" },
  { id:"pr5", customer_name:"Tanvir H.", rating:4, text:"Good work, completed on time. Would hire again.", date:"2025-04-15", service_title:"Plumbing Repair" },
];

const PROVIDER_EARNINGS_DATA = {
  weekly: [
    { week_label:"Week 1", amount:3200 },
    { week_label:"Week 2", amount:2800 },
    { week_label:"Week 3", amount:4500 },
    { week_label:"Week 4", amount:3900 },
  ],
  transactions: [
    { id:"pt1", date:"2025-05-10", booking_id:"b103", service:"Electrical Wiring", gross:500, net:425, payout_status:"paid" },
    { id:"pt2", date:"2025-05-08", booking_id:"b105", service:"Plumbing Repair", gross:450, net:382, payout_status:"paid" },
    { id:"pt3", date:"2025-05-05", booking_id:"b102", service:"Home Deep Cleaning", gross:1200, net:1020, payout_status:"processing" },
    { id:"pt4", date:"2025-05-03", booking_id:"b101", service:"AC General Servicing", gross:800, net:680, payout_status:"scheduled" },
    { id:"pt5", date:"2025-04-28", booking_id:"b106", service:"Wall Painting", gross:2500, net:2125, payout_status:"paid" },
  ],
  total_earned: 10150,
  this_month: 2950,
  last_month: 7100,
  pending_payout: 1700,
};

export async function fetchProviderBookings(providerId) {
  await delay(300);
  return PROVIDER_BOOKINGS.filter((b) => b.provider_id === providerId);
}

export async function fetchProviderReviews(providerId) {
  await delay(300);
  return PROVIDER_REVIEWS_DATA;
}

export async function fetchProviderEarnings(providerId) {
  await delay(300);
  return PROVIDER_EARNINGS_DATA;
}

export async function updateProviderBookingStatus(bookingId, status) {
  await delay(200);
  const idx = PROVIDER_BOOKINGS.findIndex((b) => b.id === bookingId);
  if (idx !== -1) PROVIDER_BOOKINGS[idx] = { ...PROVIDER_BOOKINGS[idx], status };
  return { error: null };
}
