

// Sticky class in vanilla js 

 var STICKY_TRIGGER = 80;

 var scrollpos = window.scrollY;
  var el = document.getElementsByTagName('body');
  console.log(el);
  function add_class_on_scroll() {
      el['0'].classList.add("iSticky");
  }
  function remove_class_on_scroll() {
      el['0'].classList.remove("iSticky");
  }
  window.addEventListener('scroll', function(){ 
      scrollpos = window.scrollY;
      if(scrollpos > STICKY_TRIGGER){
          add_class_on_scroll();
      }
      else {
          remove_class_on_scroll();
      }
  });