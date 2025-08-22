document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('taskForm');
    const textInput = document.getElementById('taskText');
    const dateInput = document.getElementById('dueAt');
    const list = document.getElementById('board');
    let tasks = [];


    if (localStorage.getItem('tasks')) {
        try {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            showTasks();
        } catch {
            alert('שגיאה בטעינת משימות');
            tasks = [];
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const text = (textInput.value || '').trim();
        const due = (dateInput.value || '').trim();

        if (!text || !due) {
            alert('נא למלא את כל השדות');
            return;
        }

        tasks.push({ text, due });
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch {
            alert('שגיאה בשמירה');
        }
        showTasks();
        form.reset();
    });

    function formatDate(iso) {

        const d = new Date(iso);
        if (isNaN(d)) return iso;
        return new Intl.DateTimeFormat('he-IL', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(d);
    }

    function showTasks() {
        list.innerHTML = '';

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];


            const card = document.createElement('div');
            card.className = 'my-card';


            const content = document.createElement('div');
            content.className = 'my-content';
            content.style.flex = '1';


            const textDiv = document.createElement('div');
            textDiv.className = 'my-task-text';
            textDiv.textContent = task.text;

            const meta = document.createElement('div');
            meta.className = 'my-meta';
            const dateEl = document.createElement('span');
            dateEl.className = 'my-date';
            dateEl.textContent = formatDate(task.due);
            meta.appendChild(dateEl);

            content.appendChild(textDiv);
            content.appendChild(meta);

            const actions = document.createElement('div');
            actions.className = 'my-actions';
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'my-btn';
            delBtn.textContent = 'מחק';
            delBtn.setAttribute('data-index', String(i));
            actions.appendChild(delBtn);

            card.appendChild(content);
            card.appendChild(actions);
            list.appendChild(card);
        }
    }


    list.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.tagName === 'BUTTON' && target.hasAttribute('data-index')) {
            const idx = Number(target.getAttribute('data-index'));
            tasks.splice(idx, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            showTasks();
        }
    });
});