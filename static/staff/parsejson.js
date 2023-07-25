console.log(window.location.search);
let staff = window.location.search.replace("?","")
let cellphone = "";
fetch("https://github.com/Academy-of-Learning-Career-College/aolccbc.com/raw/main/www/staff/" + staff + ".json")
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
//            console.log(data)
            document.getElementById('avatar').innerHTML = "<img src='https://github.com/Academy-of-Learning-Career-College/aolccbc.com/raw/main/www/staff/avatars/" + staff + ".png?as=webp' alt='Profile Picture' class='avatar'>";
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
            fetch("https://github.com/Academy-of-Learning-Career-College/aolccbc.com/raw/main/www/staff/campusinfo.json")
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

