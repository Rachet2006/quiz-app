const page = document.body.dataset.page;


if (page === "questions-page"){
    async function fetchQuestions() {
        const diff = localStorage.getItem("difficulty");
        const cate = localStorage.getItem("category");
        const qnum = localStorage.getItem("amount");
        console.log(diff, cate, qnum);
        const res = await fetch(`https://opentdb.com/api.php?amount=${qnum}&category=${cate}&difficulty=${diff}&type=boolean`);
        const data = await res.json();
        console.log(data);
        return data.results;
    }

    async function storeData (){
        Q = await fetchQuestions();
        loadQuestion();
    }

    function decodeHTML(str) {
        return new DOMParser().parseFromString(str, "text/html").body.textContent;
    }

    let Q = [];
    const questionEl = document.getElementById("question");
    const choices = document.querySelectorAll(".choice");
    const answerBox = document.getElementById("answer");
    const answerText = document.getElementById("answer-text");
    const nextBtn = document.getElementById("next");
    const restartBtn = document.getElementById("restart");
    let qnum = 0;
    let currentAnswer = "";
    let Score = 0;

    storeData();
    choices.forEach(choice => {
        choice.addEventListener("click", () => {

            choices.forEach(btn => {btn.disabled = true;});

            const selected = choice.value;
            const correct = currentAnswer;
            
             if (selected === correct) {
                Score++;
                answerText.textContent = "✅ Correct!";
                answerBox.style.backgroundColor='#f0fdf4';
                choice.style.backgroundColor = "#d1fae5";
            } else {
                answerText.textContent = "❌ Incorrect!";
                answerBox.style.backgroundColor='#f87171';
                choice.style.backgroundColor = "#fee2e2";
            }

            answerBox.style.display = "block";
            qnum++;
        })
    })

    async function loadQuestion(){
        const q = Q[qnum];
        questionEl.textContent = decodeHTML(q.question);
        currentAnswer = q.correct_answer;

        choices.forEach(choice => {
            choice.disabled = false;
            choice.style.backgroundColor = "aliceblue";
        })
        answerBox.style.display = "none";

        console.log(q);
    }

    restartBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    })

    nextBtn.addEventListener("click", () => {
        if(qnum > localStorage.getItem("amount")-1){
            answerBox.style.display = "none";
            nextBtn.hidden = true;
            restartBtn.style.float = none;
            questionEl.textContent = "All done - thanks for playing!";
            choices.forEach(choice => {
                if(choice.value == "True"){
                    choice.value = `Score: ${Score}`;
                    choice.style.backgroundColor = "aliceblue";
                } else {
                    choice.hidden = true;
                }
            })
            nextBtn.disabled = true;
        } else {
            loadQuestion();
        }
    })

} else if(page === "home"){

    const goBtn = document.getElementById("start");
    goBtn.addEventListener("click", () => {
        localStorage.clear();
        const diff = document.getElementById("difficulty").value;
        const cate = document.getElementById("category").value;
        const qnum = document.getElementById("amount").value
        localStorage.setItem("category", cate);;
        localStorage.setItem("difficulty", diff);
        localStorage.setItem("amount", qnum);
        window.location.href = "questions.html";
    })
}
