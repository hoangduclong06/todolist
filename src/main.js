import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import './style.css'



const messages = {
    English: {
        hello: "What's up,",
        create_a_todo: "CREATE A TODO",
        what_on_your_todo: "What's on your todo list?",
        deadline: "Deadline: ",
        category: "Pick a category",
        business: "Business",
        personal: "Personal",
        addTodo: "Add todo",
        todolist: "TODO LIST"
    },
    Vietnamese: {
        hello: "Xin chào,",
        create_a_todo: "TẠO VIỆC CẦN LÀM",
        what_on_your_todo: "Có gì trong danh sách việc cần làm của bạn?",
        deadline: "Ngày hết hạn: ",
        category: "Chọn danh mục",
        business: "Công việc",
        personal: "Cá nhân",
        addTodo: "Tạo việc cần làm",
        todolist: "DANH SÁCH VIỆC CẦN LÀM"
    }
}
const i18n = createI18n({
    locale: 'English',
    fallbackLocale: 'Vietnamese',
    messages,
})

const app = createApp(App);


app.use(i18n)
app.mount('#app')