import type { MenuItem } from '../../menu/types/menu.types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Grilled Salmon',
    category: 'Main Course',
    price: 24.99,
    status: 'available',
    lastUpdate: '2025-12-20',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    description: 'Fresh Atlantic salmon with herbs, lemon butter sauce and seasonal vegetables',
    modifiers: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'small', name: 'Small', price: 0 },
          { id: 'medium', name: 'Medium', price: 2.00 },
          { id: 'large', name: 'Large', price: 4.00 },
        ]
      },
      {
        id: 'toppings',
        name: 'Toppings',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'cheese', name: 'Extra Cheese', price: 1.00 },
          { id: 'mushrooms', name: 'Mushrooms', price: 0.75 },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Caesar Salad',
    category: 'Appetizer',
    price: 10.50,
    status: 'available',
    lastUpdate: '2025-12-22',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    description: 'Crisp romaine lettuce with Caesar dressing, croutons and parmesan cheese',
  },
  {
    id: 3,
    name: 'Beef Wellington',
    category: 'Main Course',
    price: 38.00,
    status: 'available',
    lastUpdate: '2025-12-15',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    description: 'Premium beef tenderloin wrapped in puff pastry with mushroom duxelles',
  },
  {
    id: 4,
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    price: 9.99,
    status: 'available',
    lastUpdate: '2025-12-23',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
  },
  {
    id: 5,
    name: 'Lobster Bisque',
    category: 'Appetizer',
    price: 15.99,
    status: 'sold_out',
    lastUpdate: '2025-12-24',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    description: 'Rich and creamy lobster soup with cognac and fresh herbs',
  },
  {
    id: 6,
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 16.50,
    status: 'available',
    lastUpdate: '2025-12-21',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: 'Classic Italian pizza with fresh mozzarella, tomato sauce and basil',
    modifiers: [
      {
        id: 'pizza-size',
        name: 'Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'personal', name: 'Personal (8")', price: 0 },
          { id: 'medium', name: 'Medium (12")', price: 4.00 },
          { id: 'large', name: 'Large (16")', price: 8.00 },
        ]
      },
      {
        id: 'pizza-toppings',
        name: 'Extra Toppings',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'pepperoni', name: 'Pepperoni', price: 2.00 },
          { id: 'mushrooms', name: 'Mushrooms', price: 1.50 },
          { id: 'olives', name: 'Black Olives', price: 1.50 },
          { id: 'onions', name: 'Red Onions', price: 1.00 },
          { id: 'peppers', name: 'Bell Peppers', price: 1.50 },
        ]
      },
      {
        id: 'crust-type',
        name: 'Crust Type',
        required: false,
        selectionType: 'Single',
        options: [
          { id: 'regular', name: 'Regular Crust', price: 0 },
          { id: 'thin', name: 'Thin Crust', price: 0 },
          { id: 'thick', name: 'Thick Crust', price: 2.00 },
          { id: 'stuffed', name: 'Stuffed Crust', price: 3.50 },
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Tiramisu',
    category: 'Dessert',
    price: 8.50,
    status: 'available',
    lastUpdate: '2025-12-19',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
  },
  {
    id: 8,
    name: 'French Onion Soup',
    category: 'Appetizer',
    price: 12.50,
    status: 'available',
    lastUpdate: '2025-12-18',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    description: 'Caramelized onions in rich beef broth with melted gruyere and toasted baguette',
  },
  {
    id: 9,
    name: 'Garlic Bread',
    category: 'Appetizer',
    price: 6.00,
    status: 'available',
    lastUpdate: '2025-12-17',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400',
    description: 'Toasted baguette with garlic butter and fresh parsley',
  },
  {
    id: 10,
    name: 'Sushi Platter',
    category: 'Main Course',
    price: 45.00,
    status: 'available',
    lastUpdate: '2025-12-16',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    description: 'Assorted sushi and sashimi with wasabi, ginger and soy sauce',
    modifiers: [
      {
        id: 'sushi-size',
        name: 'Platter Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'small', name: 'Small (12 pieces)', price: -10.00 },
          { id: 'medium', name: 'Medium (18 pieces)', price: 0 },
          { id: 'large', name: 'Large (24 pieces)', price: 15.00 },
        ]
      },
      {
        id: 'sushi-extras',
        name: 'Add-ons',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'extra-wasabi', name: 'Extra Wasabi', price: 0.50 },
          { id: 'extra-ginger', name: 'Extra Ginger', price: 0.50 },
          { id: 'spicy-mayo', name: 'Spicy Mayo', price: 1.00 },
          { id: 'eel-sauce', name: 'Eel Sauce', price: 1.00 },
        ]
      }
    ]
  },
  {
    id: 11,
    name: 'Miso Soup',
    category: 'Appetizer',
    price: 8.00,
    status: 'available',
    lastUpdate: '2025-12-15',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
    description: 'Traditional Japanese soup with tofu, seaweed and green onions',
  },
  {
    id: 12,
    name: 'Green Tea Ice Cream',
    category: 'Dessert',
    price: 8.00,
    status: 'available',
    lastUpdate: '2025-12-14',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    description: 'Authentic Japanese matcha ice cream with red bean',
  },
  {
    id: 13,
    name: 'Club Sandwich',
    category: 'Main Course',
    price: 14.00,
    status: 'available',
    lastUpdate: '2025-12-13',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400',
    description: 'Triple-decker sandwich with turkey, bacon, lettuce, tomato and mayo',
    modifiers: [
      {
        id: 'bread-type',
        name: 'Bread Type',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'white', name: 'White Bread', price: 0 },
          { id: 'wheat', name: 'Wheat Bread', price: 0 },
          { id: 'sourdough', name: 'Sourdough', price: 1.50 },
          { id: 'rye', name: 'Rye Bread', price: 1.00 },
        ]
      },
      {
        id: 'sandwich-extras',
        name: 'Add-ons',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'extra-bacon', name: 'Extra Bacon', price: 2.50 },
          { id: 'avocado', name: 'Avocado', price: 2.00 },
          { id: 'cheese', name: 'Cheese', price: 1.50 },
          { id: 'pickles', name: 'Pickles', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: 14,
    name: 'Iced Coffee',
    category: 'Beverage',
    price: 5.50,
    status: 'available',
    lastUpdate: '2025-12-12',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    description: 'Cold brew coffee served over ice with milk and sugar',
  },
  {
    id: 15,
    name: 'Truffle Burger',
    category: 'Main Course',
    price: 28.50,
    status: 'available',
    lastUpdate: '2025-12-11',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    description: 'Premium beef patty with truffle aioli, arugula and aged cheddar',
    modifiers: [
      {
        id: 'burger-doneness',
        name: 'Doneness',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'rare', name: 'Rare', price: 0 },
          { id: 'medium-rare', name: 'Medium Rare', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'medium-well', name: 'Medium Well', price: 0 },
          { id: 'well-done', name: 'Well Done', price: 0 },
        ]
      },
      {
        id: 'burger-toppings',
        name: 'Add Toppings',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'bacon', name: 'Bacon', price: 3.00 },
          { id: 'fried-egg', name: 'Fried Egg', price: 2.50 },
          { id: 'avocado', name: 'Avocado', price: 2.50 },
          { id: 'caramelized-onions', name: 'Caramelized Onions', price: 1.50 },
          { id: 'extra-cheese', name: 'Extra Cheese', price: 2.00 },
        ]
      }
    ]
  },
  {
    id: 16,
    name: 'Lobster Linguine',
    category: 'Main Course',
    price: 38.00,
    status: 'available',
    lastUpdate: '2025-12-10',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    description: 'Fresh lobster tail over linguine pasta with tomato cream sauce',
    modifiers: [
      {
        id: 'pasta-spice',
        name: 'Spice Level',
        required: false,
        selectionType: 'Single',
        options: [
          { id: 'mild', name: 'Mild', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'spicy', name: 'Spicy', price: 0 },
        ]
      },
      {
        id: 'pasta-extras',
        name: 'Add-ons',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'extra-lobster', name: 'Extra Lobster', price: 12.00 },
          { id: 'garlic-bread', name: 'Garlic Bread', price: 3.00 },
          { id: 'parmesan', name: 'Extra Parmesan', price: 1.50 },
          { id: 'white-wine', name: 'White Wine Reduction', price: 2.00 },
        ]
      }
    ]
  },
  {
    id: 17,
    name: 'Caprese Salad',
    category: 'Appetizer',
    price: 11.00,
    status: 'available',
    lastUpdate: '2025-12-09',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
    description: 'Fresh mozzarella, tomatoes and basil with balsamic glaze',
  },
  {
    id: 18,
    name: 'Pad Thai',
    category: 'Main Course',
    price: 18.00,
    status: 'available',
    lastUpdate: '2025-12-08',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    description: 'Traditional Thai stir-fried rice noodles with shrimp, egg and peanuts',
    modifiers: [
      {
        id: 'padthai-protein',
        name: 'Protein Choice',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'shrimp', name: 'Shrimp', price: 0 },
          { id: 'chicken', name: 'Chicken', price: -2.00 },
          { id: 'tofu', name: 'Tofu (Vegetarian)', price: -3.00 },
          { id: 'combo', name: 'Shrimp & Chicken Combo', price: 3.00 },
        ]
      },
      {
        id: 'spice-level',
        name: 'Spice Level',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'mild', name: 'Mild', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'spicy', name: 'Spicy', price: 0 },
          { id: 'extra-spicy', name: 'Extra Spicy', price: 0 },
        ]
      },
      {
        id: 'padthai-extras',
        name: 'Extras',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'extra-peanuts', name: 'Extra Peanuts', price: 1.00 },
          { id: 'extra-lime', name: 'Extra Lime', price: 0.50 },
          { id: 'bean-sprouts', name: 'Bean Sprouts', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: 19,
    name: 'Tom Yum Soup',
    category: 'Appetizer',
    price: 13.00,
    status: 'available',
    lastUpdate: '2025-12-07',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    description: 'Spicy and sour Thai soup with shrimp, mushrooms and lemongrass',
  },
  {
    id: 20,
    name: 'Mango Sticky Rice',
    category: 'Dessert',
    price: 7.50,
    status: 'available',
    lastUpdate: '2025-12-06',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1597328117573-2e5511f26c30?w=400',
    description: 'Sweet sticky rice with fresh mango and coconut cream',
  },
  {
    id: 21,
    name: 'Ribeye Steak',
    category: 'Main Course',
    price: 42.00,
    status: 'available',
    lastUpdate: '2025-12-05',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    description: '12oz prime ribeye with garlic herb butter and roasted potatoes',
    modifiers: [
      {
        id: 'steak-size',
        name: 'Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: '8oz', name: '8oz', price: -6.00 },
          { id: '12oz', name: '12oz (Standard)', price: 0 },
          { id: '16oz', name: '16oz', price: 8.00 },
        ]
      },
      {
        id: 'steak-doneness',
        name: 'Doneness',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'rare', name: 'Rare', price: 0 },
          { id: 'medium-rare', name: 'Medium Rare', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'medium-well', name: 'Medium Well', price: 0 },
          { id: 'well-done', name: 'Well Done', price: 0 },
        ]
      },
      {
        id: 'steak-sides',
        name: 'Side Dish',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'mashed-potatoes', name: 'Mashed Potatoes', price: 0 },
          { id: 'grilled-veggies', name: 'Grilled Vegetables', price: 0 },
          { id: 'mac-cheese', name: 'Mac & Cheese', price: 3.00 },
          { id: 'asparagus', name: 'Asparagus', price: 4.00 },
        ]
      }
    ]
  },
  {
    id: 22,
    name: 'Bruschetta',
    category: 'Appetizer',
    price: 9.50,
    status: 'available',
    lastUpdate: '2025-12-04',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    description: 'Toasted bread topped with tomatoes, garlic, basil and olive oil',
  },
  {
    id: 23,
    name: 'Cheesecake',
    category: 'Dessert',
    price: 9.00,
    status: 'available',
    lastUpdate: '2025-12-03',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400',
    description: 'New York style cheesecake with strawberry sauce',
  },
  {
    id: 24,
    name: 'Latte',
    category: 'Beverage',
    price: 5.00,
    status: 'available',
    lastUpdate: '2025-12-02',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400',
    description: 'Espresso with steamed milk and light foam',
    modifiers: [
      {
        id: 'coffee-size',
        name: 'Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'small', name: 'Small (8oz)', price: 0 },
          { id: 'medium', name: 'Medium (12oz)', price: 1.00 },
          { id: 'large', name: 'Large (16oz)', price: 2.00 },
        ]
      },
      {
        id: 'milk-type',
        name: 'Milk Type',
        required: false,
        selectionType: 'Single',
        options: [
          { id: 'whole', name: 'Whole Milk', price: 0 },
          { id: 'skim', name: 'Skim Milk', price: 0 },
          { id: 'almond', name: 'Almond Milk', price: 0.75 },
          { id: 'oat', name: 'Oat Milk', price: 0.75 },
          { id: 'soy', name: 'Soy Milk', price: 0.50 },
        ]
      },
      {
        id: 'coffee-extras',
        name: 'Add-ons',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'extra-shot', name: 'Extra Espresso Shot', price: 1.00 },
          { id: 'vanilla', name: 'Vanilla Syrup', price: 0.75 },
          { id: 'caramel', name: 'Caramel Syrup', price: 0.75 },
          { id: 'whipped-cream', name: 'Whipped Cream', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: 25,
    name: 'Fish and Chips',
    category: 'Main Course',
    price: 19.50,
    status: 'available',
    lastUpdate: '2025-12-01',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400',
    description: 'Beer-battered cod with crispy fries and tartar sauce',
    modifiers: [
      {
        id: 'portion-size',
        name: 'Portion Size',
        required: true,
        selectionType: 'Single',
        options: [
          { id: 'regular', name: 'Regular (1 piece)', price: 0 },
          { id: 'large', name: 'Large (2 pieces)', price: 7.00 },
        ]
      },
      {
        id: 'fish-sides',
        name: 'Side Options',
        required: false,
        selectionType: 'Multi',
        options: [
          { id: 'coleslaw', name: 'Coleslaw', price: 2.50 },
          { id: 'mushy-peas', name: 'Mushy Peas', price: 2.00 },
          { id: 'onion-rings', name: 'Onion Rings', price: 3.50 },
          { id: 'extra-tartar', name: 'Extra Tartar Sauce', price: 0.50 },
        ]
      }
    ]
  }
];

// Helper function to find menu item by name (case-insensitive)
export function findMenuItemByName(name: string): MenuItem | undefined {
  return MENU_ITEMS.find(
    item => item.name.toLowerCase() === name.toLowerCase()
  );
}

// Helper function to find menu item by ID
export function findMenuItemById(id: number): MenuItem | undefined {
  return MENU_ITEMS.find(item => item.id === id);
}
