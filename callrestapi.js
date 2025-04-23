var url= "https://animales-sql-restapi.onrender.com/api/animals";

function postAnimal() {
    var myName = $('#name').val();
    var mySpecies = $('#species').val();
    var myAge = $('#age').val();
    var myHabitat = $('#habitat').val();
    var myGender = $('#gender').val();
    var myDiet = $('#diet').val();
    var myDescription = $('#description').val();

    var myAnimal = {
        name: myName,
        species: mySpecies,
        age: myAge,
        habitat: myHabitat,
        gender: myGender,
        diet: myDiet,
        description: myDescription
    };

    console.log(myAnimal);

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            showToast('✅ Animal agregado con éxito');
            $('#name').val('');
            $('#species').val('');
            $('#age').val('');
            $('#habitat').val('');
            $('#gender').val('');
            $('#diet').val('');
            $('#description').val('');
            getAnimals();
        },
        data: JSON.stringify(myAnimal)
    });
}

function getAnimals() {
    console.log(url);

    $.getJSON(url,
      function(json) {
        console.log(json);

        var arrAnimals = json.animals;
        var htmlCards = '<div class="cards-container">';

        arrAnimals.forEach(function(item) {
            console.log(item);
            htmlCards += `
        <div class="animal-card">
          <h3>${item.name}</h3>
          <p><strong>Especie:</strong> ${item.species}</p>
          <p><strong>Edad:</strong> ${item.age}</p>
          <p><strong>Hábitat:</strong> ${item.habitat}</p>
          <p><strong>Género:</strong> ${item.gender}</p>
          <p><strong>Dieta:</strong> ${item.diet}</p>
          <p><strong>Descripción:</strong> ${item.description}</p>
          <div class="card-buttons">
            <button onclick="deleteAnimal(${item.id})">Eliminar</button>
            <button onclick="openEditModal(${item.id}, '${item.name}', '${item.species}', ${item.age}, '${item.habitat}', '${item.gender}', '${item.diet}', '${item.description}')">Editar</button>
          </div>
        </div>
      `;
    });

    htmlCards += '</div>';
    $('#resultado').html(htmlCards);
      }
    );
}

function getAnimalById() {
    var id = $('#search-id').val();

    if (!id) {
        alert('Por favor, ingresa un ID para buscar');
        return;
    }

    $.getJSON(url + '/' + id, function(json) {
        console.log(json);
        var animal = json.animal;
        
        if (animal) {
            var htmlAnimal = `
                <h3>Detalles del Animal:</h3>
                <p>ID: ${animal.id}</p>
                <p>Nombre: ${animal.name}</p>
                <p>Especie: ${animal.species}</p>
                <p>Edad: ${animal.age}</p>
                <p>Hábitat: ${animal.habitat}</p>
                <p>Género: ${animal.gender}</p>
                <p>Dieta: ${animal.diet}</p>
                <p>Descripción: ${animal.description}</p>
            `;
            $('#resultado').html(htmlAnimal);
            $('#search-id').val('');
        } else {
            $('#resultado').html('<p>No se encontró un animal con ese ID.</p>');
        }
    }).fail(function() {
        alert('Error al obtener el animal. Asegúrate de que el ID sea válido.');
    });
}

function deleteAnimal(id) {
    if (confirm("¿Estás segura de que quieres eliminar al animal con id " + id + "?")) {
        $.ajax({
            url: url + "/" + id,
            type: 'DELETE',
            success: function (data) {
                console.log(data);
                showToast('🗑️ Animal eliminado con éxito');
                getAnimals();
            },
            error: function (err) {
                console.error(err);
                showToast('Error al eliminar animal');
            }
        });
    }
}

function openEditModal(id, name, species, age, habitat, gender, diet, description) {
  $('#edit-id').val(id);
  $('#edit-name').val(name);
  $('#edit-species').val(species);
  $('#edit-age').val(age);
  $('#edit-habitat').val(habitat);
  $('#edit-gender').val(gender);
  $('#edit-diet').val(diet);
  $('#edit-description').val(description);
  $('#editModal').removeClass('hidden');
}

function closeModal() {
  $('#editModal').addClass('hidden');
}

function confirmEdit() {
  const id = $('#edit-id').val();
  const updatedAnimal = {
    name: $('#edit-name').val(),
    species: $('#edit-species').val(),
    age: $('#edit-age').val(),
    habitat: $('#edit-habitat').val(),
    gender: $('#edit-gender').val(),
    diet: $('#edit-diet').val(),
    description: $('#edit-description').val()
  };

  $.ajax({
    url: `${url}/${id}`,
    type: 'put',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(updatedAnimal),
    success: function (data) {
      closeModal();
      getAnimals();
      showToast('🐾 Animal actualizado correctamente');
    }
  });
}

