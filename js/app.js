const mainDiv = document.getElementById('main');
const employees = new Array;


function fetchEmployeeData(url) {
    return fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => {
        const results = data.results;
        results.forEach(person => {
            const employee = createEmployee(person);
            employees.push(employee)
        })
        createEmployeeCards()      
      })
      .catch(err => console.log('Looks like there was a problem.', err));
  }

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function createEmployee(person) {
    const employee = new Employee();
    const name = `${person.name.first} ${person.name.last}`;
    employee.name = name;
    employee.email = person.email;
    employee.location = person.location.city;
    employee.imgUrl = person.picture.medium;
    employee.phone = person.phone;
    const street = `${person.location.street.number} ${person.location.street.name}`;
    employee.street = street;
    const dob = `${person.dob.date.substring(5, 7)}/${person.dob.date.substring(8, 10)}/${person.dob.date.substring(0, 4)}`;
    employee.dob = dob;
    employee.state = person.location.state;
    employee.postCode = person.location.postcode;
    return employee;
}

function createEmployeeCards() {
    employees.forEach((employee, index) => {
        const div = document.createElement('div');
        div.className = 'min-employee-card';
        div.classList.add('card');
        div.dataset.index = index;
        div.id = employee.name;
        div.innerHTML = 
        `  
            <div class='min-profile-img-container'>
                <img class='min-profile-img' src='${employee.imgUrl}' alt='Photo of ${employee.name}'>
            </div>
            <div class='min-profile-info' >
                <h3>${employee.name}</h3>
                <p>${employee.email}</p>
                <p>${employee.location}</p>
            </div>
        `
        mainDiv.append(div);
    })
}

function displayOverlay(employee, index) {
    const div = document.createElement('div');
    div.className ='overlay';
    div.dataset.index = index;
    div.innerHTML = 
    `
        <div class="modal">
            <button class="modal-close">X</button>
            <div class="modal-content">
                <img class="avatar" src="${employee.imgUrl}">
                <div class="text-container">
                    <h2 class="name">${employee.name}</h2>
                    <p class="email">${employee.email}</p>
                    <p class="city">${employee.location}</p>
                    <hr>
                    <p class="phone">${employee.phone}</p>
                    <p class="street">${employee.street}, ${employee.state} ${employee.postCode}</p>
                    <p class="dob">Birthday: ${employee.dob}</p>
                </div>
                <div class='overlay-nav' id='nav-left'><</div>
                <div class='overlay-nav' id='nav-right'>></div>
            </div>
        </div>
    `;
    mainDiv.append(div);


} 

function removeOverlay() {
    const overlay = document.querySelector('.overlay');
    mainDiv.removeChild(overlay)
}

function getUserInput() {
    const userInput = document.querySelector('#directory-search').value;
    return userInput.toLowerCase();
}

function compareText(userInput) {
    userInput = getUserInput();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const textToMatch = card.id.toLowerCase();
        if(textToMatch.includes(userInput) !== true) {
            card.style.display = 'none'
        }
        else {
            card.style.display = 'flex'
        }
    })
}

mainDiv.addEventListener('click', e => {
    if (e.target !== mainDiv && e.target.className !== 'modal-close' && e.target.className !== 'overlay-nav') {
        const card = e.target.closest('.card');
        const index = card.getAttribute('data-index');
        displayOverlay(employees[index], index);
    }
    else if (e.target.className === 'modal-close') {
        removeOverlay();
    }
    else if (e.target.id === 'nav-right') {
        const overlay = e.target.closest('.overlay');
        let index = parseInt(overlay.getAttribute('data-index'));
        removeOverlay();
        if (index < employees.length-1) {
            index++
        }
        else {
            index = 0;
        }
        displayOverlay(employees[index], index);
    }
    else if (e.target.id === 'nav-left') {
        const overlay = e.target.closest('.overlay');
        let index = parseInt(overlay.getAttribute('data-index'));
        removeOverlay();
        if (index > 0) {
            index--
        }
        else {
            index = employees.length-1;
        }
        displayOverlay(employees[index], index);
    }
})


fetchEmployeeData('https://randomuser.me/api/?results=12')



