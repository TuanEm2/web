const products = [
      {
        id: 1,
        name: "Cayo Chore Jacket Navy",
        category: "Jackets",
        size: ["M", "L", "XL", "XXL"],
        price: 7650000,
        image: "assets/images/jackets/Cayo Chore Jacket Navy.png",
      },

      {
        id: 2,
        name: "Cayo Chore Jacket Beige",
        category: "Jackets",
        size: ["XS", "S", "M"],
        price: 7650000,
        image: "assets/images/jackets/Cayo Chore Jacket Beige.png",
      },

      {
        id: 3,
        name: "Oaxaca Jacket Powder Blue",
        category: "Jackets",
        size: ["M", "L", "XL"],
        price: 8679000,
        image: "assets/images/jackets/Oaxaca Jacket Powder Blue.png",
      },

      {
        id: 4,
        name: "Inigo Long Sleeve Ivory",
        category: "T-Shirts",
        size: ["S", "M", "L", "XL", "XXL"],
        price: 4119000,
        image: "assets/images/tshirts/Inigo Long Sleeve Ivory.png",
      },

      {
        id: 5,
        name: "Inigo T-Shirt Chocolate Brown",
        category: "T-Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 3531000,
        image: "assets/images/tshirts/Inigo T-Shirt Chocolate Brown.png",
      },

      {
        id: 6,
        name: "Palmido T-Shirt Navy",
        category: "T-Shirts",
        size: ["S", "M", "L"],
        price: 2648000,
        image: "assets/images/tshirts/Palmido T-Shirt Navy.png",
      },

      {
        id: 7,
        name: "Cotton Open Knit Quinn Polo Camel",
        category: "Polo",
        size: ["M", "L", "XL", "XXL"],
        price: 3090000,
        image: "assets/images/polos/Cotton Open Knit Quinn Polo Camel.png",
      },

      {
        id: 8,
        name: "Cotton Open Knit Quinn Polo Navy",
        category: "Polo",
        size: ["S", "M", "L"],
        price: 3090000,
        image: "assets/images/polos/Cotton Open Knit Quinn Polo Navy.png",
      },

      {
        id: 9,
        name: "Cotton Open Knit Quinn Polo Powder Blue",
        category: "Polo",
        size: ["XS", "S", "M", "L"],
        price: 3090000,
        image: "assets/images/polos/Cotton Open Knit Quinn Polo Powder Blue.png",
      },

      {
        id: 10,
        name: "Cotton Open Knit Quinn Polo White",
        category: "Polo",
        size: ["S", "M", "L", "XL", "XXL"],
        price: 3090000,
        image: "assets/images/polos/Cotton Open Knit Quinn Polo White.png",
      },

      {
        id: 11,
        name: "Lazarus Long Sleeve Polo Chocolate Brown",
        category: "Polo",
        size: ["M", "L", "XL"],
        price: 4119000,
        image: "assets/images/polos/Lazarus Long Sleeve Polo Chocolate Brown.png",
      },

      {
        id: 12,
        name: "Long Sleeved Silk Blend Trogon Polo Black",
        category: "Polo",
        size: ["M", "L", "XL", "XXL"],
        price: 4413000,
        image: "assets/images/polos/Long Sleeved Silk Blend Trogon Polo Black.png",
      },

      {
        id: 13,
        name: "Melia Silk Blend Knitted Polo Black",
        category: "Polo",
        size: ["S", "M", "L"],
        price: 5296000,
        image: "assets/images/polos/Melia Silk Blend Knitted Polo Black.png",
      },

      {
        id: 14,
        name: "Santiago Quinn Cotton Open Knit Polo Navy",
        category: "Polo",
        size: ["M", "L", "XL", "XXL"],
        price: 3237000,
        image: "assets/images/polos/Santiago Quinn Cotton Open Knit Polo Navy.png",
      },

      {
        id: 15,
        name: "Sporty Zip Boucle Knit Polo Beige",
        category: "Polo",
        size: ["XS", "S", "M", "L"],
        price: 3825000,
        image: "assets/images/polos/Sporty Zip Boucle Knit Polo Beige.png",
      },

      {
        id: 16,
        name: "Swirl Geo Quinn Polo Khaki",
        category: "Polo",
        size: ["M", "L", "XL"],
        price: 3678000,
        image: "assets/images/polos/Swirl Geo Quinn Polo Khaki.png",
      },

      {
        id: 17,
        name: "Alvaro Knitted Shirt Khaki",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 4119000,
        image: "assets/images/shirts/Alvaro Knitted Shirt Khaki.png",
      },

      {
        id: 18,
        name: "Checkerboard Knit Shirt Pine Green",
        category: "Shirts",
        size: ["S", "M", "L"],
        price: 3825000,
        image: "assets/images/shirts/Checkerboard Knit Shirt Pine Green.png",
      },

      {
        id: 19,
        name: "Checkerboard Knit Shirt White",
        category: "Shirts",
        size: ["XS", "S", "M", "L"],
        price: 3825000,
        image: "assets/images/shirts/Checkerboard Knit Shirt White.png",
      },

      {
        id: 20,
        name: "Ecovero Vicose Valbonne Shirt Ivory Powder Blue",
        category: "Shirts",
        size: ["M", "L", "XL"],
        price: 4413000,
        image: "assets/images/shirts/Ecovero Vicose Valbonne Shirt Ivory Powder Blue.png",
      },

      {
        id: 21,
        name: "Ecovero Vicose Valbonne Shirt Ivory",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 4413000,
        image: "assets/images/shirts/Ecovero Vicose Valbonne Shirt Ivory.png",
      },

      {
        id: 22,
        name: "Ecovero Vicose Valbonne Shirt Navy",
        category: "Shirts",
        size: ["S", "M", "L"],
        price: 4413000,
        image: "assets/images/shirts/Ecovero Vicose Valbonne Shirt Navy.png",
      },

      {
        id: 23,
        name: "Jorge Vicose Knit Polo Shirt Chocolate Brown",
        category: "Shirts",
        size: ["XS", "S", "M", "L"],
        price: 3237000,
        image: "assets/images/shirts/Jorge Vicose Knit Polo Shirt Chocolate Brown.png",
      },

      {
        id: 24,
        name: "Jorge Vicose Knit Polo Shirt Ivory",
        category: "Shirts",
        size: ["M", "L", "XL"],
        price: 3237000,
        image: "assets/images/shirts/Jorge Vicose Knit Polo Shirt Ivory.png",
      },

      {
        id: 25,
        name: "Jorge Vicose Knit Polo Shirt Navy",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 3237000,
        image: "assets/images/shirts/Jorge Vicose Knit Polo Shirt Navy.png",
      },

      {
        id: 26,
        name: "Linen Shirt Navy",
        category: "Shirts",
        size: ["S", "M", "L"],
        price: 4119000,
        image: "assets/images/shirts/Linen Shirt Navy.png",
      },

      {
        id: 27,
        name: "Linen Shirt Oat",
        category: "Shirts",
        size: ["XS", "S", "M", "L"],
        price: 4119000,
        image: "assets/images/shirts/Linen Shirt Oat.png",
      },

      {
        id: 28,
        name: "Linen Shirt White",
        category: "Shirts",
        size: ["M", "L", "XL"],
        price: 4119000,
        image: "assets/images/shirts/Linen Shirt White.png",
      },

      {
        id: 29,
        name: "Linen Shirt Powder Blue",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 4119000,
        image: "assets/images/shirts/Linen Shirt Powder Blue.png",
      },

      {
        id: 30,
        name: "Linen Shirt Sage",
        category: "Shirts",
        size: ["S", "M", "L"],
        price: 4119000,
        image: "assets/images/shirts/Linen Shirt Sage.png",
      },

      {
        id: 31,
        name: "Moneto Print Long Sleeve Shirt Khaki",
        category: "Shirts",
        size: ["XS", "S", "M", "L"],
        price: 4413000,
        image: "assets/images/shirts/Moneto Print Long Sleeve Shirt Khaki.png",
      },

      {
        id: 32,
        name: "Moneto Print Long Sleeve Shirt Navy",
        category: "Shirts",
        size: ["M", "L", "XL"],
        price: 4413000,
        image: "assets/images/shirts/Moneto Print Long Sleeve Shirt Navy.png",
      },

      {
        id: 33,
        name: "Tencel Shirt Khaki",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 3825000,
        image: "assets/images/shirts/Tencel Shirt Khaki.png",
      },

      {
        id: 34,
        name: "Tencel Shirt Navy",
        category: "Shirts",
        size: ["S", "M", "L"],
        price: 3825000,
        image: "assets/images/shirts/Tencel Shirt Navy.png",
      },

      {
        id: 35,
        name: "Tencel Shirt White",
        category: "Shirts",
        size: ["XS", "S", "M", "L"],
        price: 3825000,
        image: "assets/images/shirts/Tencel Shirt White.png",
      },

      {
        id: 36,
        name: "Valbonne Ecovero Signatrue Shirt Chocolate Brown",
        category: "Shirts",
        size: ["M", "L", "XL"],
        price: 4413000,
        image: "assets/images/shirts/Valbonne Ecovero Signatrue Shirt Chocolate Brown.png",
      },

      {
        id: 37,
        name: "Valbonne Ecovero Signatrue Shirt Merlot",
        category: "Shirts",
        size: ["M", "L", "XL", "XXL"],
        price: 4413000,
        image: "assets/images/shirts/Valbonne Ecovero Signature Shirt Merlot.png",
      },
  ];
