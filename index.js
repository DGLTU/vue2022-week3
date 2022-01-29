
const app = Vue.createApp({
    data() {
        return {
            data: {
                "username": "",
                "password": ""
            },
        }
    },
    methods: {
        signIn() {
            if (this.checkForm()) return
            axios.post('https://vue3-course-api.hexschool.io/v2/admin/signin', this.data)
                .then((res) => {
                    const {token,expired} = res.data
                    document.cookie = `token=${token}; expires=${new Date(expired)}; path=/`;
                    window.location="admin.html"
                })
                .catch((err) => {
                    alert('你輸入的資訊有誤')
                    this.data.username=""
                    this.data.password=""
                })
        },
        checkForm(){
            if(this.data.username==="" || this.data.password==""){
                alert('請輸入帳號密碼')
                return true
            }
        }
    },
})

app.mount("#app")