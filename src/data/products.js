import orangeJuice from '../assets/_Fresh Orange Juice in 2 Minutes - No Juicer Needed_.jpg'
import chocolateCake from '../assets/1149543873671326573.jpg'
import cappuccinoPhoto from '../assets/1142929211720425646.jpg'
import newHotCoffeeCutout from '../assets/Easy_Hot_Coffee_Recipe_for_Winter___Creamy__Frothy___Cozy_in_Just_7_Minutes-removebg-preview.png'
import newCookieCutout from '../assets/Crunchy_Butter_Cookies_Stack-removebg-preview.png'
import chocolateCoffee from '../assets/Coffee_Ad-removebg-preview.png'
import chocolateCakeCutout from '../assets/1038431626670719385-removebg-preview.png'
import coffeeArtCutout from '../assets/422353271320869878-removebg-preview.png'
import chocolateShakeCutout from '../assets/930767448267239322-removebg-preview.png'
import bananaShakeCutout from '../assets/Banana_Shake-removebg-preview.png'
import juicesCutout from '../assets/__Refresh_Your_Day_with_These_Colorful_Fresh_Fruit_Juices______-removebg-preview.png'
import biscuitCutout from '../assets/Chocolate-Biscuits-Cutout.png'
import icedAmericanoPhoto from '../assets/1150177192369234085.jpg'
import strawberryCake from '../assets/621426448634783304.jpg'
import redVelvetCake from '../assets/Red velvet cake.jpg'
import hotCoffee from '../assets/777996904423837572.jpg'
import blackCoffee from '../assets/86272149106727264.jpg'
import coldBrew from '../assets/Chocolate Cream Cold Brew.jpg'
import cookieBiscuits from '../assets/Easy Chocolate Biscuits Recipe.jpg'
import coffeeShake from '../assets/Easy Coffee Milkshake.jpg'
import greenJuice from '../assets/Fresh watermelon Juice.jpg'
import icedCoffeeSplash from '../assets/3d_Image_Of_A_Glass_Iced_Coffee_With_Ice_In_Small_Pieces__3d_Image_Of_A_Glass_Of_Iced_Coffee__With_Ice_In_Small_Pieces__Coffee_PNG_Transparent_Image_and_Clipart_for_Free_Download-removebg-preview.png'
import icedLatte from '../assets/How to Make the Perfect Iced Coffee Recipe at Home.jpg'
import icedCoffeeGlass from '../assets/Iced coffee why is it so aesthetic____.jpg'
import mochaFrappuccino from '../assets/Iced Mocha Frappuccino.jpg'
import shortbread from '../assets/Perfect Lattice Cream Shortbread Sandwich Cookies - A Classic Sweet Treat.jpg'
import strawberryShake from '../assets/Strawberry Milkshake Recipe with Fresh Berries.jpg'
import strawberrySmoothie from '../assets/Strawberry Cheesecake Protein Shake Recipe (High Protein, Creamy & Easy).jpg'
import cookieAssortment from '../assets/Sweet Cookies On White Plate Top View, Sweet Cookies, White Plate, Top View PNG Transparent Image and Clipart for Free Download.jpg'
import mangoSmoothie from '../assets/🍹 Mango Milkshake Adventure! 🥭⛰️_Get ready for a….jpg'
import layeredPastry from '../assets/Vintage Baking Recipes Worth Bringing Back.jpg'

const drinkSizes = [
  { name: 'Small', price: 0 },
  { name: 'Medium', price: 1000 },
  { name: 'Large', price: 2000 },
]
const singleAndBoxSizes = [
  { name: 'Single', price: 0 },
  { name: 'Box of 4', price: 5000 },
  { name: 'Box of 6', price: 8000 },
]

export const categories = [
  'Hot Coffee',
  'Iced Coffee & Cold Coffee',
  'Milkshakes & Smoothies',
  'Fresh Juices',
  'Cookies & Biscuits',
  'Cakes & Pastries',
  'Coffee Combos & Special Offers',
]

export const initialProducts = [
  { id: 'house-cappuccino', name: 'House Cappuccino', category: categories[0], description: 'A velvety double espresso finished with silky steamed milk.', price: 4500, sizes: drinkSizes, image: cappuccinoPhoto, badge: 'BEST SELLER', bestSeller: true, featured: true, available: true, color: 'latte' },
  { id: 'honey-latte', name: 'Honey Latte', category: categories[0], description: 'Our smooth house espresso, warm milk and a touch of local honey.', price: 5000, sizes: drinkSizes, image: coffeeArtCutout, cutout: true, badge: 'FEATURED', featured: true, available: true, color: 'latte' },
  { id: 'kigali-flat-white', name: 'Kigali Flat White', category: categories[0], description: 'Rich espresso with beautifully textured, velvety milk.', price: 4500, sizes: drinkSizes, image: hotCoffee, available: true, color: 'latte' },
  { id: 'slow-brew', name: 'Slow Brew Black', category: categories[0], description: 'A clean, comforting cup brewed slowly for a fuller flavour.', price: 3500, sizes: drinkSizes, image: blackCoffee, badge: 'CLASSIC', available: true, color: 'cocoa' },

  { id: 'cloud-nine', name: 'Cloud Nine Iced Latte', category: categories[1], description: 'Espresso, chilled milk and plenty of ice for a little lift.', price: 5500, sizes: drinkSizes, image: icedCoffeeSplash, cutout: true, badge: 'BEST SELLER', bestSeller: true, featured: true, available: true, color: 'gold' },
  { id: 'chocolate-cold-brew', name: 'Chocolate Cream Cold Brew', category: categories[1], description: 'Slow-steeped coffee with a cool, chocolate cream finish.', price: 6500, sizes: drinkSizes, image: coldBrew, badge: 'FEATURED', featured: true, available: true, color: 'cocoa' },
  { id: 'iced-americano', name: 'Iced Americano', category: categories[1], description: 'Bold espresso poured over ice. Simple, crisp and refreshing.', price: 4000, sizes: drinkSizes, image: icedAmericanoPhoto, available: true, color: 'cocoa' },
  { id: 'caramel-iced-latte', name: 'Caramel Iced Latte', category: categories[1], description: 'Chilled espresso and milk with a smooth caramel swirl.', price: 6000, sizes: drinkSizes, image: icedLatte, available: true, color: 'gold' },
  { id: 'iced-mocha-frappe', name: 'Iced Mocha Frappe', category: categories[1], description: 'Blended coffee, cocoa and ice topped with a little cream.', price: 7000, sizes: drinkSizes, image: mochaFrappuccino, badge: 'POPULAR', available: true, color: 'cocoa' },

  { id: 'banana-shake', name: 'Banana Milkshake', category: categories[2], description: 'Ripe banana blended smooth with chilled milk and a hint of vanilla.', price: 5000, sizes: drinkSizes, image: bananaShakeCutout, cutout: true, available: true, color: 'gold' },
  { id: 'strawberry-shake', name: 'Strawberry Milkshake', category: categories[2], description: 'Real strawberry flavour blended into a creamy, cool classic.', price: 5500, sizes: drinkSizes, image: strawberryShake, badge: 'BEST SELLER', bestSeller: true, available: true, color: 'berry' },
  { id: 'chocolate-shake', name: 'Chocolate Milkshake', category: categories[2], description: 'A rich cocoa shake finished with chocolate drizzle.', price: 5500, sizes: drinkSizes, image: chocolateCoffee, cutout: true, available: true, color: 'cocoa' },
  { id: 'mango-smoothie', name: 'Mango Smoothie', category: categories[2], description: 'Bright, ripe mango blended into a naturally sunny smoothie.', price: 6000, sizes: drinkSizes, image: mangoSmoothie, badge: 'FEATURED', featured: true, available: true, color: 'gold' },
  { id: 'strawberry-smoothie', name: 'Strawberry Cheesecake Smoothie', category: categories[2], description: 'A creamy strawberry blend inspired by our favourite cheesecake.', price: 6500, sizes: drinkSizes, image: strawberrySmoothie, available: true, color: 'berry' },
  { id: 'coffee-milkshake', name: 'Coffee Milkshake', category: categories[2], description: 'A cool, creamy milkshake blended with a shot of house espresso.', price: 6000, sizes: drinkSizes, image: coffeeShake, available: true, color: 'cocoa' },
  { id: 'milkshake-trio', name: 'Milkshake Trio', category: categories[2], description: 'Three mini favourites: chocolate, strawberry and banana.', price: 12000, sizes: [{ name: 'Trio', price: 0 }], image: chocolateShakeCutout, cutout: true, includes: ['Chocolate', 'Strawberry', 'Banana'], badge: 'TO SHARE', available: true, color: 'berry' },

  { id: 'fresh-orange', name: 'Fresh Orange Juice', category: categories[3], description: 'Freshly squeezed oranges. Bright, simple and full of sunshine.', price: 4000, sizes: drinkSizes, image: orangeJuice, badge: 'FRESH DAILY', featured: true, available: true, color: 'gold' },
  { id: 'green-garden-juice', name: 'Green Garden Juice', category: categories[3], description: 'A cool, refreshing blend of green fruit and garden-fresh goodness.', price: 4500, sizes: drinkSizes, image: greenJuice, available: true, color: 'green' },
  { id: 'rainbow-fruit-juice', name: 'Rainbow Fruit Juice', category: categories[3], description: 'A colourful mix of fresh fruit juices, made to brighten your day.', price: 5000, sizes: drinkSizes, image: juicesCutout, cutout: true, available: true, color: 'berry' },

  { id: 'choc-chip-biscuits', name: 'Chocolate Chip Biscuits', category: categories[4], description: 'Golden, buttery biscuits packed with chocolate chips.', price: 2500, sizes: singleAndBoxSizes, image: biscuitCutout, cutout: true, badge: 'BEST SELLER', bestSeller: true, available: true, color: 'gold' },
  { id: 'cream-shortbread', name: 'Cream Shortbread', category: categories[4], description: 'Delicate, crisp shortbread layered with a light cream filling.', price: 3000, sizes: singleAndBoxSizes, image: shortbread, available: true, color: 'latte' },
  { id: 'cookie-selection', name: 'Cookie Selection', category: categories[4], description: 'A fresh assortment of classic, buttery cookies to share.', price: 3500, sizes: singleAndBoxSizes, image: cookieAssortment, available: true, color: 'gold' },

  { id: 'chocolate-fudge-cake', name: 'Chocolate Fudge Cake', category: categories[5], description: 'A generous slice of soft chocolate cake with glossy ganache.', price: 5000, sizes: [{ name: 'Slice', price: 0 }, { name: 'Whole cake', price: 25000 }], image: chocolateCake, badge: 'BEST SELLER', bestSeller: true, available: true, color: 'cocoa' },
  { id: 'strawberry-cream-cake', name: 'Strawberry Cream Cake', category: categories[5], description: 'Soft sponge, fresh strawberries and a smooth cream finish.', price: 5500, sizes: [{ name: 'Slice', price: 0 }, { name: 'Whole cake', price: 28000 }], image: strawberryCake, available: true, color: 'berry' },
  { id: 'red-velvet-cake', name: 'Red Velvet Cake', category: categories[5], description: 'A tender red velvet slice finished with rich cream frosting.', price: 5000, sizes: [{ name: 'Slice', price: 0 }, { name: 'Whole cake', price: 26000 }], image: redVelvetCake, badge: 'FEATURED', featured: true, available: true, color: 'berry' },
  { id: 'strawberry-celebration-cake', name: 'Strawberry Celebration Cake', category: categories[5], description: 'A shareable layered cake topped with fresh berries and chocolate.', price: 6000, sizes: [{ name: 'Slice', price: 0 }, { name: 'Whole cake', price: 32000 }], image: chocolateCakeCutout, cutout: true, available: true, color: 'berry' },
  { id: 'chocolate-layer-slice', name: 'Chocolate Layer Slice', category: categories[5], description: 'A rich layered chocolate cake with smooth cream between every slice.', price: 5000, sizes: [{ name: 'Slice', price: 0 }, { name: 'Whole cake', price: 26000 }], image: layeredPastry, available: true, color: 'cocoa' },

  { id: 'morning-coffee-combo', name: 'Kigali Morning Combo', category: categories[6], description: 'A freshly made cappuccino and chocolate chip biscuits, together for less.', price: 6000, sizes: [{ name: 'For one', price: 0 }], images: [cappuccinoPhoto, cookieBiscuits], includes: ['House Cappuccino', 'Chocolate Chip Biscuits'], badge: 'COMBO SAVE', featured: true, available: true, color: 'latte' },
  { id: 'mocha-cake-combo', name: 'Mocha & Cake Break', category: categories[6], description: 'A chilled mocha frappe paired with a slice of chocolate fudge cake.', price: 10000, sizes: [{ name: 'For one', price: 0 }], images: [mochaFrappuccino, chocolateCake], includes: ['Iced Mocha Frappe', 'Chocolate Fudge Cake'], badge: 'SAVE 1,500 RWF', bestSeller: true, available: true, color: 'cocoa' },
  { id: 'coffee-cookie-share', name: 'Coffee & Cookie Share', category: categories[6], description: 'Two iced coffees and a box of cookies for a well-earned catch-up.', price: 14000, sizes: [{ name: 'For two', price: 0 }], images: [icedCoffeeGlass, cookieAssortment], includes: ['2 Iced Coffees', 'Cookie Selection'], badge: 'FOR TWO', featured: true, available: true, color: 'gold' },
]

export const heroSlides = [
  { name: 'Honey Latte', category: 'HOT COFFEE', image: newHotCoffeeCutout, cutout: true, productId: 'honey-latte' },
  { name: 'Cloud Nine Iced Latte', category: categories[1].toUpperCase(), image: icedCoffeeSplash, productId: 'cloud-nine' },
  { name: 'Chocolate Milkshake', category: categories[2].toUpperCase(), image: chocolateShakeCutout, productId: 'chocolate-shake' },
  { name: 'Rainbow Fruit Juice', category: categories[3].toUpperCase(), image: juicesCutout, productId: 'rainbow-fruit-juice' },
  { name: 'Chocolate Chip Biscuits', category: categories[4].toUpperCase(), image: newCookieCutout, cutout: true, productId: 'choc-chip-biscuits' },
  { name: 'Strawberry Celebration Cake', category: categories[5].toUpperCase(), image: chocolateCakeCutout, productId: 'strawberry-celebration-cake' },
  { name: 'Kigali Morning Combo', category: categories[6].toUpperCase(), images: [newHotCoffeeCutout, newCookieCutout], cutout: true, productId: 'morning-coffee-combo' },
]
