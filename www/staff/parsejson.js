

console.log(window.location.search);
let staff = window.location.search.replace("?","")
let cellphone = "";

// function importImagebase64(imagefile) {
//     fetch(imagefile)
//         .then(response => response.text())
//         .then((data) => {
//            return data.replace(new RegExp("[\r\n]", "gm"), ",");
                             
//             })
            
//     }

fetch(staff + ".json")
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            // let avatarpath = "avatars/" + staff + ".txt"
            // let avatarbase64 = importImagebase64(avatarpath);
            //console.log(avatarbase64)
            document.getElementById('avatar').innerHTML = "<img src='//aolccbc.com/staff/avatars/" + staff + ".png' alt='Profile Picture'>";
            document.getElementById('name').innerHTML = data.name;
            document.getElementById('title').innerHTML = data.title;
            document.getElementById('campus').innerHTML = `Academy of Learning Career College | ${data.campus}`;
            document.getElementById('email').innerHTML = `<span class='title'>Email: </span> <a id='mailto'> ${data.email}</a>`;
            document.getElementById('mailto').href = `mailto:${data.email}`;
            //document.getElementById('phone').innerHTML = `Academy of Learning Career College ${data.campus}`;
            if(data.cell !== undefined){
               
                cellphone = ` | <span class='title'>Cell: </span>${data.cell} `;
            }
            
            
            
            let thecampus = data.campus;
            fetch("campusinfo.json")
            .then(function(response) {
                return response.json()
            }) 
            .then(function(data){
                data.campus.forEach(campus => {
                    if(campus.name == thecampus ){
                        document.getElementById('phonefax').innerHTML = "<span class='title'>Phone: </span>" + campus.phone + " | <span class='title'>Fax: </span>" + campus.fax;
                        document.getElementById('address').innerHTML = "<span class='title'>Address: </span>" + campus.address;
                        document.getElementById('tf').innerHTML = "<span class='title'>Toll Free: </span>" + campus.tf + cellphone;
                        return; 
                    }
                });

            });
            
              })

