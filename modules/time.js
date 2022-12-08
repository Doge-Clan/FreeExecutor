export const WindowTime = {
  year: 2022, // Imagine assuming the year of development
  month: 12,
  day: 13,
  hour: 0,
  minute: 0,
  second: 0,
  update: function() {
    const t = window.time;
    let d = new Date();
      
    // Update it now.
    t.year = d.getFullYear();
    t.month = d.getMonth() + 1; // Adding +1 to offset range of 0-11 to 1-12 (Who the hell uses 0-11?)
    t.day = d.getDate(); // Why the fuck was this not a function
    t.hour = d.getHours();
    t.minute = d.getMinutes();
    t.second = d.getSeconds();
  }
}; // Totally not assuming the release date
  
/*
 window.time/WindowTime is a new API that simply reads off the current time. That is literally it.
*/