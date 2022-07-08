const mainDiv = document.getElementById('main');
const overlay = document.querySelector('.overlay')

function fetchEmployeeData(url) {
    return fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => {
        const results = data.results;
        results.forEach(person => {
            const employee = createEmployee(person);
            createEmployeeCard(employee);
        })
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
    console.log(employee);
    return employee;

}

function createEmployeeCard(employee) {
    const div = document.createElement('div');
    div.className = 'min-employee-card';
    div.innerHTML = 
    `
        <div class='min-profile-img-container'>
            <img class='min-profile-img' src='${employee.imgUrl}' alt='Photo of ${employee.name}'>
        </div>
        <div class='min-profile-info'>
            <h3>${employee.name}</h3>
            <p>${employee.email}</p>
            <p>${employee.location}</p>
        </div>
    `
    mainDiv.append(div);
}

mainDiv.addEventListener('click', (e) => {
    if (e.target.className = 'min-employee-card') {
        overlay.style.display = 'block';
    };
    
})

fetchEmployeeData('https://randomuser.me/api/?results=12')


