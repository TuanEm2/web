document.addEventListener("DOMContentLoaded", () => {
  const productsTableBody = document.querySelector("#productsTable tbody");
  const addBtn = document.querySelector(".add-btn");
  const filterSelect = document.getElementById("filterType");
  const searchInput = document.getElementById("searchProduct");

  const productTypes = ["Jacket", "T-Shirt", "Polo", "Shirt"];

  // Lấy dữ liệu từ localStorage hoặc sử dụng dữ liệu mặc định
  // localStorage.setItem('productsData',JSON.stringify(products));
  
  // const iTems=JSON.parse(localStorage.getItem('productsData'))

  let products = 
  [{id:1,name:"Cayo Chore Jacket Navy",category:"Jacket",price:7650000,image:"assets/images/jackets/Cayo Chore Jacket Navy.png",size:{XS:5,S:8,M:10,L:12,XL:6}},
  {id:2,name:"Cayo Chore Jacket Beige",category:"Jacket",price:7650000,image:"assets/images/jackets/Cayo Chore Jacket Beige.png",size:{XS:3,S:7,M:12,L:8,XL:5}},
  {id:3,name:"Oaxaca Jacket Powder Blue",category:"Jacket",price:8679000,image:"assets/images/jackets/Oaxaca Jacket Powder Blue.png",size:{XS:0,S:6,M:9,L:10,XL:5}},
  {id:4,name:"Inigo Long Sleeve Ivory",category:"T-Shirt",price:4119000,image:"assets/images/tshirts/Inigo Long Sleeve Ivory.png",size:{XS:2,S:5,M:8,L:10,XL:6}},
  {id:5,name:"Inigo T-Shirt Chocolate Brown",category:"T-Shirt",price:3531000,image:"assets/images/tshirts/Inigo T-Shirt Chocolate Brown.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
  {id:6,name:"Palmido T-Shirt Navy",category:"T-Shirt",price:2648000,image:"assets/images/tshirts/Palmido T-Shirt Navy.png",size:{XS:2,S:5,M:7,L:6,XL:4}},
  {id:7,name:"Cotton Open Knit Quinn Polo Camel",category:"Polo",price:3090000,image:"assets/images/polos/Cotton Open Knit Quinn Polo Camel.png",size:{XS:0,S:4,M:6,L:8,XL:5}},
  {id:8,name:"Cotton Open Knit Quinn Polo Navy",category:"Polo",price:3090000,image:"assets/images/polos/Cotton Open Knit Quinn Polo Navy.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:9,name:"Cotton Open Knit Quinn Polo Powder Blue",category:"Polo",price:3090000,image:"assets/images/polos/Cotton Open Knit Quinn Polo Powder Blue.png",size:{XS:2,S:4,M:5,L:6,XL:3}},
  {id:10,name:"Cotton Open Knit Quinn Polo White",category:"Polo",price:3090000,image:"assets/images/polos/Cotton Open Knit Quinn Polo White.png",size:{XS:0,S:3,M:6,L:7,XL:4}},
  {id:11,name:"Lazarus Long Sleeve Polo Chocolate Brown",category:"Polo",price:4119000,image:"assets/images/polos/Lazarus Long Sleeve Polo Chocolate Brown.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:12,name:"Long Sleeved Silk Blend Trogon Polo Black",category:"Polo",price:4413000,image:"assets/images/polos/Long Sleeved Silk Blend Trogon Polo Black.png",size:{XS:0,S:2,M:5,L:7,XL:4}},
  {id:13,name:"Melia Silk Blend Knitted Polo Black",category:"Polo",price:5296000,image:"assets/images/polos/Melia Silk Blend Knitted Polo Black.png",size:{XS:1,S:3,M:4,L:5,XL:2}},
  {id:14,name:"Santiago Quinn Cotton Open Knit Polo Navy",category:"Polo",price:3237000,image:"assets/images/polos/Santiago Quinn Cotton Open Knit Polo Navy.png",size:{XS:0,S:4,M:6,L:7,XL:3}},
  {id:15,name:"Sporty Zip Boucle Knit Polo Beige",category:"Polo",price:3825000,image:"assets/images/polos/Sporty Zip Boucle Knit Polo Beige.png",size:{XS:2,S:4,M:5,L:6,XL:3}},
  {id:16,name:"Swirl Geo Quinn Polo Khaki",category:"Polo",price:3678000,image:"assets/images/polos/Swirl Geo Quinn Polo Khaki.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:17,name:"Alvaro Knitted Shirt Khaki",category:"Shirt",price:4119000,image:"assets/images/shirts/Alvaro Knitted Shirt Khaki.png",size:{XS:0,S:5,M:8,L:10,XL:4}},
  {id:18,name:"Checkerboard Knit Shirt Pine Green",category:"Shirt",price:3825000,image:"assets/images/shirts/Checkerboard Knit Shirt Pine Green.png",size:{XS:2,S:4,M:6,L:7,XL:3}},
  {id:19,name:"Checkerboard Knit Shirt White",category:"Shirt",price:3825000,image:"assets/images/shirts/Checkerboard Knit Shirt White.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:20,name:"Ecovero Vicose Valbonne Shirt Ivory Powder Blue",category:"Shirt",price:4413000,image:"assets/images/shirts/Ecovero Vicose Valbonne Shirt Ivory Powder Blue.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:21,name:"Ecovero Vicose Valbonne Shirt Ivory",category:"Shirt",price:4413000,image:"assets/images/shirts/Ecovero Vicose Valbonne Shirt Ivory.png",size:{XS:1,S:4,M:6,L:8,XL:3}},
  {id:22,name:"Ecovero Vicose Valbonne Shirt Navy",category:"Shirt",price:4413000,image:"assets/images/shirts/Ecovero Vicose Valbonne Shirt Navy.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:23,name:"Jorge Vicose Knit Polo Shirt Chocolate Brown",category:"Shirt",price:3237000,image:"assets/images/shirts/Jorge Vicose Knit Polo Shirt Chocolate Brown.png",size:{XS:1,S:3,M:4,L:5,XL:2}},
  {id:24,name:"Jorge Vicose Knit Polo Shirt Ivory",category:"Shirt",price:3237000,image:"assets/images/shirts/Jorge Vicose Knit Polo Shirt Ivory.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:25,name:"Jorge Vicose Knit Polo Shirt Navy",category:"Shirt",price:3237000,image:"assets/images/shirts/Jorge Vicose Knit Polo Shirt Navy.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
  {id:26,name:"Linen Shirt Navy",category:"Shirt",price:4119000,image:"assets/images/shirts/Linen Shirt Navy.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:27,name:"Linen Shirt Oat",category:"Shirt",price:4119000,image:"assets/images/shirts/Linen Shirt Oat.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
  {id:28,name:"Linen Shirt White",category:"Shirt",price:4119000,image:"assets/images/shirts/Linen Shirt White.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:29,name:"Linen Shirt Powder Blue",category:"Shirt",price:4119000,image:"assets/images/shirts/Linen Shirt Powder Blue.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
  {id:30,name:"Linen Shirt Sage",category:"Shirt",price:4119000,image:"assets/images/shirts/Linen Shirt Sage.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:31,name:"Moneto Print Long Sleeve Shirt Khaki",category:"Shirt",price:4413000,image:"assets/images/shirts/Moneto Print Long Sleeve Shirt Khaki.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:32,name:"Moneto Print Long Sleeve Shirt Navy",category:"Shirt",price:4413000,image:"assets/images/shirts/Moneto Print Long Sleeve Shirt Navy.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:33,name:"Tencel Shirt Khaki",category:"Shirt",price:3825000,image:"assets/images/shirts/Tencel Shirt Khaki.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
  {id:34,name:"Tencel Shirt Navy",category:"Shirt",price:3825000,image:"assets/images/shirts/Tencel Shirt Navy.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:35,name:"Tencel Shirt White",category:"Shirt",price:3825000,image:"assets/images/shirts/Tencel Shirt White.png",size:{XS:1,S:3,M:5,L:6,XL:2}},
  {id:36,name:"Valbonne Ecovero Signatrue Shirt Chocolate Brown",category:"Shirt",price:4413000,image:"assets/images/shirts/Valbonne Ecovero Signatrue Shirt Chocolate Brown.png",size:{XS:0,S:3,M:5,L:6,XL:2}},
  {id:37,name:"Valbonne Ecovero Signatrue Shirt Merlot",category:"Shirt",price:4413000,image:"assets/images/shirts/Valbonne Ecovero Signature Shirt Merlot.png",size:{XS:1,S:4,M:6,L:7,XL:3}},
];



  // ====================== HELPERS ======================
  const saveProducts = () => localStorage.setItem("productsData", JSON.stringify(products));

  const calculateStock = sizeObj => Object.values(sizeObj).reduce((sum,val)=>sum+val,0);

  const fixImagePath = path => path || "assets/images/no-image.png";

  // ====================== RENDER ======================
  const renderProducts = () => {
    productsTableBody.innerHTML = "";
    products.forEach((p,index) => {
      const row = document.createElement("tr");
      const stock = calculateStock(p.size);
      row.innerHTML = `
        <td>${p.id}</td>
        <td><img src="${fixImagePath(p.image)}" alt="product" style="width:60px;height:60px;object-fit:cover;border-radius:6px;"></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price.toLocaleString("vi-VN")}</td>
        <td>${p.size.XS}</td>
        <td>${p.size.S}</td>
        <td>${p.size.M}</td>
        <td>${p.size.L}</td>
        <td>${p.size.XL}</td>
        <td>${stock}</td>
        <td>
          <button class="btn-edit">Sửa</button>
          <button class="btn-delete">Xóa</button>
        </td>
      `;
      //  tô màu đỏ nhạt nếu size < 5
      const sizeCells = [5, 6, 7, 8, 9]; // cột XS -> XL
      sizeCells.forEach((colIndex) => {
        const cell = row.children[colIndex];
        const value = parseInt(cell.textContent) || 0;
        if (value < 3) {
          cell.style.backgroundColor = "#ffcccc"; // đỏ nhạt
        }
      });
      attachEditDeleteEvents(row,index);
      productsTableBody.appendChild(row);
    });
    applyFilter();
    applySearch();
  }

  // ====================== FILTER ======================
  const applyFilter = () => {
    const selectedType = filterSelect?.value || "all";
    productsTableBody.querySelectorAll("tr").forEach(row => {
      const type = row.children[3].textContent.trim();
      row.style.display = (selectedType==="all"||type===selectedType)?"":"none";
    });
  }
  filterSelect?.addEventListener("change", applyFilter);

  // ====================== SEARCH ======================
  const applySearch = () => {
    const keyword = searchInput?.value.toLowerCase().trim() || "";
    productsTableBody.querySelectorAll("tr").forEach(row => {
      const name = row.children[2].textContent.toLowerCase();
      const type = row.children[3].textContent.toLowerCase();
      row.style.display = (name.includes(keyword)||type.includes(keyword))?"":"none";
    });
  }
  searchInput?.addEventListener("input", applySearch);

  // ====================== EDIT / DELETE ======================
  const attachEditDeleteEvents = (row,index) => {
    const editBtn = row.querySelector(".btn-edit");
    const deleteBtn = row.querySelector(".btn-delete");

    // Edit
    editBtn.addEventListener("click",()=>{
      const p = products[index];
      const originalHTML = row.innerHTML;
      row.classList.add("editing");

      row.innerHTML = `
        <td>${p.id}</td>
        <td>
          <img src="${fixImagePath(p.image)}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;">
          <input type="file" accept="image/*" class="file-input">
        </td>
        <td contenteditable="true">${p.name}</td>
        <td>
          <select class="product-type-select">
            ${productTypes.map(t=>`<option value="${t}" ${t===p.category?"selected":""}>${t}</option>`).join("")}
          </select>
        </td>
        <td contenteditable="true">${p.price}</td>
        <td contenteditable="true">${p.size.XS}</td>
        <td contenteditable="true">${p.size.S}</td>
        <td contenteditable="true">${p.size.M}</td>
        <td contenteditable="true">${p.size.L}</td>
        <td contenteditable="true">${p.size.XL}</td>
        <td>${calculateStock(p.size)}</td>
        <td>
          <button class="btn-save">Lưu</button>
          <button class="btn-cancel">Hủy</button>
        </td>
      `;
      let imgBase64 = p.image;
      const fileInput = row.querySelector(".file-input");
      fileInput.addEventListener("change",e=>{
        const file = e.target.files[0];
        if(file){
          const reader = new FileReader();
          reader.onload=ev=>{
            imgBase64=ev.target.result;
            row.querySelector("img").src = imgBase64;
          }
          reader.readAsDataURL(file);
        }
      });

      row.querySelector(".btn-save").addEventListener("click",()=>{
        const nameNew = row.children[2].innerText.trim();
        const categoryNew = row.querySelector(".product-type-select").value;
        const priceNew = parseFloat(row.children[4].innerText)||0;
        const sizeNew = {
          XS:parseInt(row.children[5].innerText)||0,
          S:parseInt(row.children[6].innerText)||0,
          M:parseInt(row.children[7].innerText)||0,
          L:parseInt(row.children[8].innerText)||0,
          XL:parseInt(row.children[9].innerText)||0
        };
        products[index] = {...p,name:nameNew,category:categoryNew,price:priceNew,image:imgBase64,size:sizeNew};
        saveProducts();
        renderProducts();
      });

      row.querySelector(".btn-cancel").addEventListener("click",()=>{
        row.innerHTML = originalHTML;
        row.classList.remove("editing");
        attachEditDeleteEvents(row,index);
      });
    });

    // Delete
    deleteBtn.addEventListener("click",()=>{
      if(confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")){
        products.splice(index,1);
        saveProducts();
        renderProducts();
      }
    });
  }

  // ====================== ADD PRODUCT ======================
  addBtn?.addEventListener("click",()=>{
    const newRow = document.createElement("tr");
    newRow.classList.add("editing");
    let imgBase64 = "assets/images/no-image.png";

    newRow.innerHTML = `
      <td>--</td>
      <td>
        <img src="${imgBase64}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
        <input type="file" class="file-input">
      </td>
      <td contenteditable="true">Nhập tên sản phẩm</td>
      <td>
        <select class="product-type-select">
          ${productTypes.map(t=>`<option value="${t}">${t}</option>`).join("")}
        </select>
      </td>
      <td contenteditable="true">0</td>
      <td contenteditable="true">0</td>
      <td contenteditable="true">0</td>
      <td contenteditable="true">0</td>
      <td contenteditable="true">0</td>
      <td contenteditable="true">0</td>
      <td>0</td>
      <td>
        <button class="btn-save">Lưu</button>
        <button class="btn-cancel">Hủy</button>
      </td>
    `;
    const fileInput = newRow.querySelector(".file-input");
    const imgPreview = newRow.querySelector("img");
    fileInput.addEventListener("change", e=>{
      const file = e.target.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload=ev=>{
          imgBase64 = ev.target.result;
          imgPreview.src = imgBase64;
        }
        reader.readAsDataURL(file);
      }
    });

    newRow.querySelector(".btn-save").addEventListener("click",()=>{
      const name = newRow.children[2].innerText.trim();
      const category = newRow.querySelector(".product-type-select").value;
      const price = parseFloat(newRow.children[4].innerText)||0;
      const size = {
        XS:parseInt(newRow.children[5].innerText)||0,
        S:parseInt(newRow.children[6].innerText)||0,
        M:parseInt(newRow.children[7].innerText)||0,
        L:parseInt(newRow.children[8].innerText)||0,
        XL:parseInt(newRow.children[9].innerText)||0
      };
      const newProduct = {
        id:Date.now(),
        name,
        category,
        price,
        image:imgBase64,
        size
      };
      products.push(newProduct);
      saveProducts();
      renderProducts();
    });

    newRow.querySelector(".btn-cancel").addEventListener("click",()=>newRow.remove());
    productsTableBody.appendChild(newRow);
    newRow.scrollIntoView({behavior:"smooth"});
  });

  // ====================== INIT ======================
  renderProducts();
});
