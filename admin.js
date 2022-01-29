import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'
let productModal = null;
let delModal = null;

createApp({
    data() {
        return {
            token: "",
            baseUrl: "https://vue3-course-api.hexschool.io/v2/api",
            apiPath: "lesley588",
            product: [],
            temp: {
                imagesUrl: []
            },
            state: "",
        }
    },
    created() {
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        axios.defaults.headers.common['Authorization'] = this.token
        this.checkSignin()
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        })
        delModal = new bootstrap.Modal(document.getElementById('delProduct'), {
            keyboard: false
        })
    },
    methods: {
        checkSignin() {
            axios.post('https://vue3-course-api.hexschool.io/v2/api/user/check')
                .then((res) => {
                    this.getProduct()
                })
                .catch((err) => {
                    alert('請重新登入')
                    window.location = "index.html"
                })
        },
        openModal(state, data) {
            this.state = state
            this.temp = { ...data }
            if (state === "add") {
                this.temp = {
                    imagesUrl: []
                }
                productModal.show()
            } else if (state === "edit") {
                productModal.show()
            } else if (state === 'delete') {
                delModal.show()
            }
        },
        getProduct() {
            axios.get(`${this.baseUrl}/${this.apiPath}/admin/products/`)
                .then((res) => {
                    this.product = res.data.products
                })
                .catch((err) => {
                    console.dir(err);
                })
        },
        updateProduct(state) {
            if (this.checkFormVale(this.temp)) return
            let http = 'post'
            let url = `${this.baseUrl}/${this.apiPath}/admin/product/`
            let msg = '新增商品成功 !'
            if(!this.temp.imagesUrl.length){
                this.temp.imagesUrl=['']
            }
            if (state === "edit") {
                http = 'put'
                url = `${this.baseUrl}/${this.apiPath}/admin/product/${this.temp.id}`
                msg = '編輯商品成功 !'
            }
            axios[http](url, { data: this.temp })
                .then((res) => {
                    alert(msg)
                    this.getProduct()
                    productModal.hide()
                })
                .catch((err) => {
                    console.dir(err);

                    alert(err.message)
                    productModal.hide()
                })
        },

        editProduct(id) {
            console.log(this.temp);
            if (this.checkFormVale(this.temp)) return
            let { data } = this.temp
            axios.put(`${this.baseUrl}/${this.apiPath}/admin/product/${id}`, { data })
                .then((res) => {
                    this.getProduct()
                    alert('編輯商品成功')
                })
                .catch((err) => {
                    alert('編輯失敗')
                    console.dir(err.message);

                })
        },
        delProduct(id) {
            axios.delete(`${this.baseUrl}/${this.apiPath}/admin/product/${id}`)
                .then((res) => {
                    alert('刪除產品成功')
                    delModal.hide()
                    this.getProduct()
                })
                .catch((err) => {
                    alert(err.message)
                    delModal.hide()
                })
        },
        checkFormVale(productData) {
            let data = { ...productData }
            if (data.title === "" || data.category === "" || data.origin_price < 0 || data.price < 0 || data.unit === "" || data.description === "" || data.content === "" || data.imageUrl === "") {
                alert('請填寫完整資訊')
                return true
            } else {
                return false
            }
        },
        createImg(i, value) {
            this.temp.imagesUrl[i] = value
            console.log(this.temp.imagesUrl);
        }
    },
}).mount("#app")