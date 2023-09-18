import './style.css'

//Function to fetch locations
const fetchLocation = async () => {

  try {
    let response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=bronx&count=8&language=en&format=json`,);
    console.log(response)

    if (response.status === 200) {
      let data = await response.json();
      console.log(data);

      let locations = data.results

      return locations;
    }

    // if (data.results){
    //   console.log(data.results)
    // }
    // else {
    //   console.log('no results to show!')
    // }
  }
  catch (error) {
    console.log(error);
  }


}



//Function to display locations.
const displayLocations = async () => {
  const showLocations = await fetchLocation();

  console.log(showLocations)

  //
  //Handle error here if no results found later
  //


  const displayLocation = showLocations.map(item =>
    `<div class="individual-location id="${item.id}"
      data-lat-value=${item.latitude} 
      data-long-value=${item.longitude}>

      <h2>State: ${item.admin1} </h2>
      <h2>Name: ${item.name} </h2>
      <h2>Country: ${item.country} </h2>
      <p>lat: ${item.latitude} </p>
      <p>long: ${item.longitude}</p>
      
    </div>`
  ).join("");

  document.querySelector(".parent-container").innerHTML = displayLocation;

  document.querySelectorAll(".individual-location").forEach((item) => {
    item.addEventListener("click", async function () {
      const lat = this.getAttribute("data-lat-value");
      const long = this.getAttribute("data-long-value");

      console.log(lat, long)

    })
  });

}


displayLocations();








