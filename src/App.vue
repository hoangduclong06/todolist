<script setup>
import Editor from "@tinymce/tinymce-vue";
import { ref, onMounted, computed, watch } from "vue";
import { toast } from "vue3-toastify";
import en from "./en.js";
import vi from "./vi.js";
import moment from "moment";

const todos = ref([]);
const name = ref("");
const input_content = ref("");
const input_deadline = ref("");
const input_category = ref(null);
const todos_asc = computed(() =>
  todos.value.sort((a, b) => {
    return a.createdAt - b.createdAt;
  })
);

watch(name, (newVal) => {
  localStorage.setItem("name", newVal);
});
watch(
  todos,
  (newVal) => {
    localStorage.setItem("todos", JSON.stringify(newVal));
  },
  {
    deep: true,
  }
);

const addTodo = () => {
  if (input_content.value.trim() === "" || input_category.value === null) {
    return;
  }
  todos.value.push({
    content: input_content.value,
    category: input_category.value,
    done: false,
    editable: false,
    createdAt: new Date().getTime(),
    deadline: input_deadline.value,
    exprired: false,
  });
};
const removeTodo = (todo) => {
  todos.value = todos.value.filter((t) => t !== todo);
};
onMounted(() => {
  name.value = localStorage.getItem("name") || "";
  todos.value = JSON.parse(localStorage.getItem("todos")) || [];

  console.log("11111", todos.value);
  setInterval(() => {
    //  new Date().toLocaleTimeString()
    todos.value.forEach((item) => {
      const deadLine = moment(item.deadline);
      const curre̵ntTime = moment();

      if (deadLine.isBefore(curre̵ntTime) && !item.exprired) {
        todos.value = todos.value.map((todo) =>
          todo.content === item.content ? { ...item, exprired: true } : todo
        );
        alert(item.content, "da het han");
      }
    });
  }, 5000);
});
</script>

<template>
  <main class="app">
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>

    <section class="greeting">
      <h2 class="title">
        What's up,
        <input type="text" id="name" placeholder="Name here" v-model="name" />
      </h2>
    </section>

    <section class="create-todo">
      <h3>CREATE A TODO</h3>

      <form id="new-todo-form" @submit.prevent="addTodo">
        <h4>What's on your todo list?</h4>
        <editor
          name="content"
          id="content"
          v-model="input_content"
          api-key="j4lyb31jk59eq8i6cujabqmoah0mk0h52re4kkq4r7ddi1xo"
          :init="{
            height: 300,
            menubar: true,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
          }"
        />
        <input
          type="datetime-local"
          name="deadline"
          id="deadline"
          placeholder="e.g. make a video"
          v-model="input_deadline"
        />

        <h4>Pick a category</h4>
        <div class="options">
          <label>
            <input
              type="radio"
              name="category"
              id="category1"
              value="business"
              v-model="input_category"
            />
            <span class="bubble business"></span>
            <div>Business</div>
          </label>

          <label>
            <input
              type="radio"
              name="category"
              id="category2"
              value="personal"
              v-model="input_category"
            />
            <span class="bubble personal"></span>
            <div>Personal</div>
          </label>
        </div>

        <input type="submit" value="Add todo" />
      </form>
    </section>

    <section class="todo-list">
      <h3>TODO LIST</h3>
      <div class="list" id="todo-list">
        <div
          v-for="todo in todos_asc"
          :key="todo"
          :class="`todo-item ${todo.done && 'done'}`"
        >
          <label>
            <input type="checkbox" v-model="todo.done" />

            <span
              :class="`bubble ${
                todo.category == 'business' ? 'business' : 'personal'
              }`"
            ></span>
          </label>

          <div class="todo-content">
            <span type="text" v-html="todo.content"> </span>
          </div>
          <div class="deadline">
            Deadline: {{ moment(todo.deadline).format("DD/MM/YYYY, HH:mm") }}
          </div>

          <div class="actions">
            <button class="delete" @click="removeTodo(todo)">Delete</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>