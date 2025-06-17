'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Samuel Ntadom',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1234,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////CREATING DOM ELEMENTS
containerMovements.innerHTML = '';
const displayMovements = function (movements, sort = false) {
  //sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class = "movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
  `;

    //insertAdjacentHTML: This is a method that uses HTML to create an element in relation to another element.
    // The method takes two parameters: the first is the position for the new element, and the second is string with the code for creating the new element
    //Note: Check MDN for more info

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(intr => intr >= 1)
    .reduce((acc, intr) => acc + intr, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//Note: The forEach method is used on arrays when a side effect is required, but the map method is used when no side effect is required.

const createUsernames = function (accs) {
  accs.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = acc => {
  // Display movements
  containerMovements.innerHTML = '';
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};
///////////IMPLEMENTING LOGIN
// Event handlers
//button for login
//Note: The default behavior of a button in a form is to submit the form/ reload the webpage after it is clicked.
//Also, clicking 'enter' when a form's input field is selected will trigger a click event on the button-- in simple terms, it will click the button

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Preventing the default behaviour of buttons in a form with the entries parameter
  e.preventDefault();
  // this will prevent the page from reloading when the button is clicked

  currentAccount = accounts.find(acc => acc.owner === inputLoginUsername.value);

  // Note: 'input.value' returns a string
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //1. Display UI message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.slice(
      0,
      currentAccount.owner.indexOf(' ')
    )}`;
    //Retrieving the first name from a string
    // labelWelcome.textContent = `Welcome back, ${
    // currentAccount.owner.split(' ')[0]
    // }`;

    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //Clear input focus
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

////////////// IMPLEMENTING TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.owner === inputTransferTo.value);

  console.log(currentAccount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.owner !== currentAccount.owner
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

///////////////////IMPLEMENTING LOANING WITH THE SOME(any) METHOD
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  } else {
    alert(`You do not have enough money to loan ${amount}`);
  }
  inputLoanAmount.value = '';
});
////////////////CLOSE ACCOUNT/ DELETING ACCOUNTS
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.owner === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.owner === currentAccount.owner;
    });

    inputCloseUsername.value = inputClosePin.value = '';

    //Delete account
    //Note:There is more difference between the splice method and the slice method.
    // The splice method takes in two parameters: the first is for the first value you want to extract from the array, and the second is for the amount of values, including the first, that should be extracted
    //accounts.splice(index, 1); // This means that the splice method will only remove the element at the selected index from the array. If the second parameter passed in was 2, it would mean that the splice method would remove the element at the index and the element succceding it

    labelWelcome.textContent = 'Log in to get started';
    //Hide UI
    containerApp.style.opacity = 0;
  }
});

/////////SORTING BUTTON
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
// ['USD', 'United States dollar'],
// ['EUR', 'Euro'],
// ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
