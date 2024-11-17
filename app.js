const CONTRACT_ADDRESS = "0xf5E4902E311E1BD63771d78C333D44c999e71B26"
const web3 = new Web3(window.ethereum)
let contractABI, contractInstance


initialize()

async function initialize() {

  if (!await loadWeb3()) {
    alert("Please install metamask or ethereum compatible browser")
    return
  }

  const response = await fetch('contract/contract_ABI.json')
  if (!response.ok) throw new Error('aaa')
  contractABI = await response.json()
  contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS)

  await getAccounts()

}

async function loadWeb3() {
  if (window.ethereum) {
    window.ethereum.request({
      method: 'eth_requestAccounts'
    }).then(result => {
    })
    return true
  }
  return false
}

async function getAccounts() {
  const accounts = await web3.eth.getAccounts()


  document.getElementById('lbl-address').textContent = accounts[0]
  await getAccountBalance(accounts[0])
  await getUser(accounts[0])
}

async function getAccountBalance(accountAddress) {
  let balance = await web3.eth.getBalance(accountAddress)
  balance = web3.utils.fromWei(balance, 'ether')
}

async function getUser(_address) {
  console.log('getuser', _address);

  contractInstance.methods.mapUsers(_address).call((err, result) => {
    if (err) {
      alert(err)
      return
    }
    console.log('res', result);

    if (result.isActive) {
      document.getElementById('divUserInfo').classList.remove('d-none')
      document.getElementById('divReigister').classList.add('d-none')

      document.getElementById('name').value = result.name
      document.getElementById('country').value = result.country
      document.getElementById('gender').value = result.gender
      document.getElementById('email').value = result.email

    }
  })
}

async function addUser() {
  //_address

  const _address = document.getElementById('lbl-address').innerHTML
  const _name = document.getElementById('name').value
  const _country = document.getElementById('country').value
  const _email = document.getElementById('email').value
  const _gender = document.getElementById('gender').value

  contractInstance.methods.registerUser(_name, _country, _email, _gender).send({ from: _address })
    .on('transactionHash'((hash) => {
      document.getElementById('loader').classList.remove('d-none')
      console.log(hash)
    }))
    .on('confirmation'((confirmationNumber, receipt) => {
      if (confirmationNumber === 0) {
        document.getElementById('loader').classList.add('d-none')
        alert('Transaction successfull')
      }

      console.log(hash)
    }))
    .on('error'((error) => {
      document.getElementById('loader').classList.remove('d-none')
      console.log(error)
    }))

}
async function updateUser() {

  const _address = document.getElementById('lbl-address').innerHTML
  const _name = document.getElementById('name').value
  const _country = document.getElementById('country').value
  const _email = document.getElementById('email').value
  const _gender = document.getElementById('gender').value

  contractInstance.methods.updateUser(_name, _country, _email, _gender).send({ from: _address })
    .on('transactionHash'((hash) => {
      document.getElementById('loader').classList.remove('d-none')
      console.log(hash)
    }))
    .on('confirmation'((confirmationNumber, receipt) => {
      if (confirmationNumber === 0) {
        document.getElementById('loader').classList.add('d-none')
        alert('Transaction successfull')
      }
    }))
    .on('error'((error) => {
      document.getElementById('loader').classList.remove('d-none')
      console.log(error)
    }))

}

async function deleteUser() {
  const _address = document.getElementById('lbl-address').innerHTML
  const _userAddr = document.getElementById('txtUserAddress').value


  contractInstance.methods.deleteUser(_userAddr).send({ from: _address })
    .on('transactionHash', function (hash) {
      document.getElementById('loader').classList.remove('d-none')
      console.log(hash);
    })
    .on('confirmation', function (confirmationNumber, receipt) {
      if (confirmationNumber === 0) {
        document.getElementById('loader').classList.add('d-none')
        alert("Transaction successfull")
      }
    })
    .on('error', function (error, receipt) {
      document.getElementById('loader').classList.remove('d-none')
      console.log('error');
      console.log(error);
      alert("Transaction failed")
    })
}