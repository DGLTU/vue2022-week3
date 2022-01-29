const app = Vue.createApp({
    data() {
        return {
            token:"",
            baseUrl:"https://vue3-course-api.hexschool.io/v2/api",
            apiPath:"lesley588",
            product: [],
            temp: {
                "data": {

                }
            },
            addProductData: {
                "data": {
                    "title": "",
                    "category": "",
                    "origin_price": 0,
                    "price": 0,
                    "unit": "",
                    "description": "",
                    "content": "",
                    "is_enabled": 0,
                    "imageUrl": "",
                    "imagesUrl": ["圖片網址一", "圖片網址二", "圖片網址三", "圖片網址四", "圖片網址五"]
                }
            },
        }
    },
    created() {
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common['Authorization'] = this.token
        this.checkSignin()
    },
    methods: {
        checkSignin() {
            axios.post('https://vue3-course-api.hexschool.io/v2/api/user/check')
                .then((res) => {
                    this.getProduct()
                })
                .catch((err) => {
                    console.dir(err);
                    alert('請重新登入')
                    window.location = "https://dgltu.github.io/vue2022-week3/index.html"
                })
        },
        getProduct() {
            axios.get(`${this.baseUrl}/${this.apiPath}/admin/products/`)
                .then((res) => {
                    console.log(res.data);
                    this.product = res.data.products
                })
                .catch((err) => {
                    console.dir(err);
                })
        },
        addProduct() {
            if (this.checkFormVale(this.addProductData)) return
            let { data } = this.addProductData
            axios.post(`${this.baseUrl}/${this.apiPath}/admin/product/`, { data })
                .then((res) => {
                    console.log(res);
                    alert('新增產品成功 !')
                    this.getProduct()
                })
                .catch((err) => {
                    console.dir(err.message);
                })
        },
        checkFormVale(productData) {
            let { data } = productData
            if (data.title === "" || data.category === "" || data.origin_price < 0 || data.price < 0 || data.unit === "" || data.description === "" || data.content === "" || data.imageUrl === "") {
                alert('請填寫完整資訊')
                return true
            } else {
                return false
            }
        },
        delProduct(id) {
            axios.delete(`${this.baseUrl}/${this.apiPath}/admin/product/${id}`)
                .then((res) => {
                    alert('刪除產品成功')
                    this.getProduct()
                    console.log(res)
                })
                .catch((err) => console.dir(err.message))
        },
        editProduct(id) {
            console.log(this.temp);
            if(this.checkFormVale(this.temp)) return
            let {data} = this.temp
            axios.put(`${this.baseUrl}/${this.apiPath}/admin/product/${id}`,{data})
                .then((res) => {
                    this.getProduct()
                    alert('編輯商品成功')
                })
                .catch((err) => {
                    alert('編輯失敗')
                    console.dir(err.message);

                })
        },
        createImg(i, value) {
            this.temp.imagesUrl[i] = value
            console.log(this.temp.imagesUrl);

        }
    },
})

app.mount("#app")