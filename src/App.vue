<script setup>
import Editor from "@tinymce/tinymce-vue";
import { ref, onMounted, computed, watch } from "vue";
import moment from "moment";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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

const showToast = (e) => {
  toast.info("Thẻ " + "[ " + e + " ]" + " của bạn đã hết hạn", {
    autoClose: 3000,
    position: "top-center",
  });
};

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
const showToastDelete = (e) => {
  toast.error(
    "Bạn đã xoá thẻ " + "[ " + e.replace(/<[^>]+>/g, "") + " ]" + " thành công",
    {
      autoClose: 3000,
      position: "top-center",
    }
  );
};
const showToastDone = (e) => {
  toast.success(
    "Chúc mừng bạn đã hoàn thành thẻ " +
      "[ " +
      e.replace(/<[^>]+>/g, "") +
      " ]",
    {
      autoClose: 3000,
      position: "top-center",
    }
  );
};
const showToastAddSuccess = () => {
  toast.success("Thêm thẻ thành công", {
    autoClose: 3000,
    position: "top-center",
  });
};
const showToastAddFault = () => {
  toast.error("Bạn chưa điền đủ thông tin", {
    autoClose: 3000,
    position: "top-center",
  });
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
        const a = item.content.replace(/<[^>]+>/g, "");
        showToast(a);
      }
    });
  }, 5000);
});
</script>

<template>
  <main class="app">
    <select v-model="$i18n.locale" class="lang">
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
        {{ $t("hello") }}
        <input type="text" id="name" placeholder="Name here" v-model="name" />
      </h2>
    </section>

    <section class="create-todo">
      <h3>{{ $t("create_a_todo") }}</h3>

      <form id="new-todo-form" @submit.prevent="addTodo">
        <h4>{{ $t("what_on_your_todo") }}</h4>
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
        <div class="deadline_dt">
          {{ $t("deadline") }}
          <input
            class="input_deadline"
            type="datetime-local"
            name="deadline"
            id="deadline"
            placeholder="e.g. make a video"
            v-model="input_deadline"
          />
        </div>

        <h4>{{ $t("category") }}</h4>
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
            <div>{{ $t("business") }}</div>
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
            <div>{{ $t("personal") }}</div>
          </label>
        </div>

        <input
          type="submit"
          value="Add todo"
          @click="
            input_content && input_deadline && input_category
              ? showToastAddSuccess()
              : showToastAddFault()
          "
        />
      </form>
    </section>

    <section class="todo-list">
      <h3 v-if="todos.length > 0">{{ $t("todolist") }}</h3>
      <div class="list" id="todo-list">
        <div
          v-for="todo in todos_asc"
          :key="todo"
          :class="`todo-item ${todo.done && 'done'}`"
        >
          <label>
            <input
              type="checkbox"
              @click="!todo.done && showToastDone(todo.content)"
              v-model="todo.done"
            />

            <span
              :class="`bubble ${
                todo.category == 'business' ? 'business' : 'personal'
              }`"
            ></span>
          </label>

          <div class="todo-content">
            <span type="text" v-html="todo.content"> </span>
          </div>

          <div
            :class="`deadline ${
              todo.done == false && todo.exprired == true && 'red'
            }`"
          >
            {{ $t("deadline") }}
            {{ moment(todo.deadline).format("DD/MM/YYYY, HH:mm") }}
          </div>

          <div class="actions">
            <button
              class="delete"
              @click="
                removeTodo(todo);
                showToastDelete(todo.content);
              "
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>