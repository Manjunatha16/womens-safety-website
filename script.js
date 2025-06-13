let userLocation = {};

function showUserModal() {
  document.getElementById("userModal").style.display = "flex";
  getLiveLocation();
}

function getLiveLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`)
          .then(res => res.json())
          .then(data => {
            document.getElementById("locationBox").innerText =
              `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}\nLandmark: ${data.display_name}`;
          });
      },
      () => {
        alert("Location access denied!");
      }
    );
  } else {
    alert("Geolocation not supported.");
  }
}

function saveUserData(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    gender: document.getElementById("gender").value,
    phone: document.getElementById("phone").value,
    parentPhone: document.getElementById("parentPhone").value,
    address: document.getElementById("address").value,
    latitude: userLocation.latitude,
    longitude: userLocation.longitude
  };

  fetch("save_user.php", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.text())
    .then(response => {
      alert(response);
      document.getElementById("userModal").style.display = "none";
    });
}

function filterPolice() {
  const district = document.getElementById("district").value;
  const taluk = document.getElementById("taluk").value;
  const pincode = document.getElementById("pincode").value;

  document.getElementById("policeContacts").innerHTML =
    `<p>SP: +91 9000000001<br>SI: +91 9000000002<br>Constable: +91 9000000003</p>
     <small>Filtered by: ${district}, ${taluk}, ${pincode}</small>`;
}

const locationData = {
  Bangalore: {
    taluks: {
      "Bangalore North": ["560001", "560002"],
      "Bangalore South": ["560068", "560076"]
    }
  },
  Mysore: {
    taluks: {
      "Mysore City": ["570001", "570002"],
      "Nanjangud": ["571301"]
    }
  },
  Belgaum: {
    taluks: {
      "Belgaum City": ["590001"],
      "Bailhongal": ["591102"]
    }
  }
};

function updateTaluks() {
  const district = document.getElementById("district").value;
  const talukSelect = document.getElementById("taluk");
  talukSelect.innerHTML = `<option value="">Select Taluk</option>`;

  if (district && locationData[district]) {
    const taluks = Object.keys(locationData[district].taluks);
    taluks.forEach(taluk => {
      const opt = document.createElement("option");
      opt.value = taluk;
      opt.innerText = taluk;
      talukSelect.appendChild(opt);
    });
  }

  updatePincodes(); // reset pincode dropdown
}

function updatePincodes() {
  const district = document.getElementById("district").value;
  const taluk = document.getElementById("taluk").value;
  const pincodeSelect = document.getElementById("pincode");
  pincodeSelect.innerHTML = `<option value="">Select Pincode</option>`;

  if (
    district &&
    taluk &&
    locationData[district] &&
    locationData[district].taluks[taluk]
  ) {
    const pincodes = locationData[district].taluks[taluk];
    pincodes.forEach(code => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.innerText = code;
      pincodeSelect.appendChild(opt);
    });
  }
}
