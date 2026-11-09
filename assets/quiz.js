// Спільний віджет коротких запитань (retrieval practice) для всього курсу.
// Підтримує два види розмітки.
//
// 1) Текстова відповідь:
//    <div class="quiz" data-answer="текст">
//      <div class="q">Питання</div>
//      <input type="text"> <button>Перевірити</button> <div class="feedback"></div>
//    </div>
//    Кілька прийнятних відповідей розділяються "|": data-answer="так|yes".
//    Показується перший варіант як еталонний.
//
// 2) Вибір варіанта:
//    <div class="quiz" data-correct="B">
//      <p class="quiz-q">Питання</p>
//      <div class="quiz-options">
//        <button class="quiz-option" data-choice="A">…</button>
//        <button class="quiz-option" data-choice="B">…</button>
//      </div>
//      <p class="quiz-feedback" data-right="…" data-wrong="…"></p>
//    </div>

(function () {
  function initTextQuiz(quiz) {
    var input = quiz.querySelector("input[type='text']");
    var button = quiz.querySelector("button");
    var feedback = quiz.querySelector(".feedback");
    if (!input || !button || !feedback) return;
    var variants = quiz.dataset.answer.split("|").map(function (s) { return s.trim().toLowerCase(); });

    function check() {
      var given = (input.value || "").trim().toLowerCase();
      feedback.classList.remove("correct", "wrong");
      if (variants.indexOf(given) !== -1) {
        feedback.textContent = "✓ Правильно";
        feedback.classList.add("correct");
      } else {
        feedback.textContent = "✗ Ні. Правильна відповідь: " + quiz.dataset.answer.split("|")[0].trim();
        feedback.classList.add("wrong");
      }
    }

    button.addEventListener("click", check);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
  }

  function initChoiceQuiz(quiz) {
    var correct = quiz.getAttribute("data-correct");
    var options = quiz.querySelectorAll(".quiz-option");
    var feedback = quiz.querySelector(".quiz-feedback");

    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chosen = btn.getAttribute("data-choice");
        options.forEach(function (b) { b.disabled = true; });

        if (chosen === correct) {
          btn.classList.add("is-correct");
          if (feedback) feedback.textContent = feedback.getAttribute("data-right") || "Правильно.";
        } else {
          btn.classList.add("is-incorrect");
          options.forEach(function (b) {
            if (b.getAttribute("data-choice") === correct) b.classList.add("is-correct");
          });
          if (feedback) feedback.textContent = feedback.getAttribute("data-wrong") || "Неправильно. Правильний варіант підсвічено.";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz[data-answer]").forEach(initTextQuiz);
    document.querySelectorAll(".quiz[data-correct]").forEach(initChoiceQuiz);
  });
})();
