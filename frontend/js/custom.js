$(document).ready(function(){
  // let url = 'http://fullstack-virtual-host:3000';
  let url; //es6 way of declaring a var

// THERE IS AN ISSUE WITH THIS CODE
  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(config){
      console.log(config);
      url = `${config.SERVER_URL}:${config.SERVER_PORT}`;
      console.log(url);
    },
    error: function(error){
      console.log('ERROR');
      console.log(error);
    }
  }); //ajax server config

  $.ajax({
    url: `${url}/allProducts`,
    type: 'GET',
    datatype: 'json',
    success: function(productsFromMongo){
      console.log(productsFromMongo);
      for (var i = 0; i < productsFromMongo.length; i++) {
        document.getElementById('result').innerHTML +=
        `<div class="col-6">${productsFromMongo[i].name}</div>${productsFromMongo[i].price}`;
      }
    }, // success
    error:function(){
      console.log('NOT WORKING');
    }
  }); // ajax mongo

// Register User
  $('#registerBtn').click(function(){
    event.preventDefault(); //this prevents code breaking when no data is found

    let username = $('#regUsername').val();
    let email = $('#regEmail').val();
    let password = $('#regPassword').val();
    console.log(username, email, password);
    if (username == '' || email == '' || password == ''){
      alert('Please enter all details');
    } else {
      $.ajax({
        url: `${url}/registerUser`,
        type: 'POST',
        data: {
          username: username,
          email: email,
          password: password
        },
        success:function(user){
          console.log(user); //remove when dev is finished
          // if currently not working
          if (user == 'Username taken already. Please try another name'){
            alert('Please login to manipulate the products data');
          } else {
            alert('username take already. Please try another name');
            $('#r-username').val('');
            $('#r-email').val('');
            $('#r-password').val('');
          } //else
        }, //success
        error: function(){
          console.log('error cannot call api');
        } //error
      }); //ajax post
    } //else
  }); //submit button for registration


// Login function
  $('#loginBtn').click(function(){
    event.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
    console.log(username, password); //remove after dev finished

    if (username == '' || password == ''){
      alert('Please enter all details');
    } else {
      $.ajax({
        url: `${url}/loginUsers`,
        type: 'POST',
        data: {
          username: username,
          password: password
        },
        success: function(user){
          // console.log(user); //remove after dev finished

          if (user == 'User not found. Please register'){
            alert('User not found. Please enter correct data or register as new user');
          } else if (user == 'not authorized') {
            alert('Please try with correct details');
            $('#username').val('');
            $('#password').val('');
          } else {
            // Windows session storage
            sessionStorage.setItem('userID', user._id);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('userEmail', user.email);
            console.log(sessionStorage);
          } //if else
        }, //success
        error:function(){
          console.log('error: cannot call api');
        }
      }); //ajax post check
    } //else
  }); //submit button for log in

  // logout
  $('#logoutBtn').click(function(){
    sessionStorage.clear();
    console.log(sessionStorage);
  });

  // add product
  $('#addProduct').click(function(){
    event.preventDefault();
    let name = $('#prodName').val();
    let price = $('#prodPrice').val();
    let imageUrl = $('#prodImageUrl').val();
    let userID = sessionStorage.getItem('userID');
    console.log(userID);
    console.log(name, price, imageUrl);
    if (name == '' || price == '' || userID == ''){
      alert('Please emter all details');
    } else {
      $.ajax({
        url: `${url}/addProduct`,
        type: 'POST',
        data: {
          name: name,
          price: price,
          image_url: imageUrl,
          user_id: userID
        }, //data that will be posted
        success: function(product){
          // console.log(product);
          alert('product added');
        }, //success
        error: function(){
          console.log('error: cannot call api');
        } //error
      }); //ajax
    } //if else
  }); //addProduct

// update the product
$('#updateProduct').click(function(){
  event.preventDefault();
  let productId = $('#productId').val();
  let productName = $('#productName').val();
  let productPrice = $('#productPrice').val();
  let imageurl = $('#imageurl').val();
  let userid =sessionStorage.getItem('userID');
  console.log(productId, productName, productPrice, imageurl, userid);
  if ( productId == ''){
    alert('Please enter product id for updating');
  } else {
    $.ajax({
      url: `${url}/updateProduct/${productId}`,
      type: 'PATCH',
      data:{
        name : productName,
        price : productPrice,
        image_url : imageurl,
        user_id: userid
      }, //data
      success: function(data){
        console.log(data);
        if(data == '401 error: user has no permission to update'){
          alert('401 error: user has no permission to update');
        } else {
          alert('updated');
        } //else
        $('#productId').val('');
        $('#productName').val('');
        $('#productPrice').val('');
        $('#imageurl').val('');
      }, //success
      error: function(){
        console.log('error:cannot call api');
      }//error
    }); //ajax
  } //if else
}); //updateProduct

// Delete product
$('#deleteProduct').click(function(){
  event.preventDefault();
  if (!sessionStorage.userID){
    alert('401 permission denied');
    return;
  }
  let productId = $('#delProductId').val();
  console.log(productId);
  if (productId == ''){
    alert('Please enter the product id to delete the product');
  } else {
    $.ajax({
      url: `${url}/deleteProduct/${productId}`,
      type: `DELETE`,
      data: {
        user_id: sessionStorage.userID
      },
      success: function(data){
        console.log(data);
        if (data == 'deleted'){
          alert('deleted');
          $('#delProductId').val('');
        } else {
          alert('Enter a valid id');
        } //else
      }, //success
      error: function(){
        console.log('error: cannot call api');
      } //error
    }); //ajax
  } //if else
}); //delete product


}); //document ready
