const outer_data = { 
    store_name: "西塔水果天堂",
    store_address: "新北市淡水區英專路151號",
    fruits: [
       { name: "蘋果", price: 30, num: 10 },
       { name: "香蕉", price: 60, num: 10 },
       { name: "芭樂", price: 120, num: 10 },
       { name: "榴槤", price: 300, num: 1 }
    ],
    selectedFruit: null, // 選中的水果
    selectedQuantity: 0, // 選中的數量
    cart: [], // 採購清單
    totalAmount: 0, // 總金額
    showEmailInput: false, // 是否顯示 Email 輸入框
    userEmail: "" // 使用者輸入的 Email
};

const app = Vue.createApp({
   data() {
       return outer_data;
   },
   methods: {
       addToCart() {
           if (this.selectedFruit && this.selectedQuantity > 0) {
               const totalPrice = this.selectedFruit.price * this.selectedQuantity;

               // 將選擇的水果加入採購清單
               this.cart.push({
                   name: this.selectedFruit.name,
                   price: this.selectedFruit.price,
                   quantity: this.selectedQuantity,
                   totalPrice: totalPrice
               });

               // 更新總金額
               this.totalAmount += totalPrice;

               // 減少水果庫存
               this.selectedFruit.num -= this.selectedQuantity;

               // 重置選擇數量
               this.selectedQuantity = 0;
           }
       },
       removeFromCart(index) {
           const item = this.cart[index];

           // 將刪除的水果數量加回庫存
           const fruit = this.fruits.find(f => f.name === item.name);
           if (fruit) {
               fruit.num += item.quantity;
           }

           // 更新總金額
           this.totalAmount -= item.totalPrice;

           // 刪除該筆資料
           this.cart.splice(index, 1);
       },
       checkout() {
           // 顯示 Email 輸入框
           this.showEmailInput = true;
           // 匯出 Excel
           this.exportToExcel();
       },
       sendEmail() {
           if (!this.userEmail) {
               alert("請輸入有效的 Email！");
               return;
           }

           // 模擬寄送信件
           const emailContent = `
               寄信者: 088775@o365.tku.edu.tw
               收信者: ${this.userEmail}
               
               感謝您的購買！
               採購清單：
               ${this.cart.map(item => `${item.name} - 數量: ${item.quantity} - 金額: ${item.totalPrice}元`).join("\n")}
               總金額: ${this.totalAmount} 元
               匯款帳號: 123456789
           `;
           console.log(`寄送至: ${this.userEmail}\n內容:\n${emailContent}`);
           alert("信件已寄出！");

           // 重置 Email 輸入框
           this.showEmailInput = false;
           this.userEmail = "";
       },
       exportToExcel() {
           if (this.cart.length === 0) {
               alert("購物車為空，無法匯出！");
               return;
           }
           // 建立 CSV 內容
           let csv = "品項,單價,數量,金額\n";
           this.cart.forEach(item => {
               csv += `${item.name},${item.price},${item.quantity},${item.totalPrice}\n`;
           });
           csv += `,,總金額,${this.totalAmount}\n`;

           // 建立 Blob 並下載
           const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
           const url = URL.createObjectURL(blob);
           const a = document.createElement("a");
           a.href = url;
           a.download = "購買清單.csv";
           document.body.appendChild(a);
           a.click();
           document.body.removeChild(a);
           URL.revokeObjectURL(url);
       }
   }
});

app.mount("#app1");

// 掉落圓點動畫
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-dots-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dots = [];
    const DOT_NUM = 30;
    const COLORS = ['#ffb6b9', '#fae3d9', '#bbded6', '#8ac6d1', '#ffd1d1'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function createDot() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            r: 8 + Math.random() * 8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            speed: 1 + Math.random() * 2
        };
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            ctx.fillStyle = dot.color;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;
            dot.y += dot.speed;
        });
        // 移除掉出畫面底部的圓點
        dots = dots.filter(dot => dot.y - dot.r < canvas.height);
        // 補足圓點數量
        while (dots.length < DOT_NUM) {
            dots.push(createDot());
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
