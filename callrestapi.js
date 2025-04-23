var url= "https://animales-sql-restapi.onrender.com/api/animals";

function postAnimal() {
    var myName = $('#name').val();
    var mySpecies = $('#species').val();
    var myAge = $('#age').val();
    var myHabitat = $('#habitat').val();
    var myDescription = $('#description').val();

    var myAnimal = {
        name: myName,
        species: mySpecies,
        age: myAge,
        habitat: myHabitat,
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
        var htmlTableAnimals = '<table border="1">';

        arrAnimals.forEach(function(item) {
            console.log(item);
            htmlTableAnimals += '<tr>' +
                                '<td>' + item.id + '</td>' +
                                '<td>' + item.name + '</td>' +
                                '<td>' + item.species + '</td>' +
                                '<td>' + item.age + '</td>' +
                                '<td>' + item.habitat + '</td>' +
                                '<td>' + item.description + '</td>' +
                                '<td><button onclick="deleteAnimal(' + item.id + ')">Eliminar</button></td>' +
                                '<td><button onclick="openEditModal(' +
  item.id + ', \'' +
  item.name + '\', \'' +
  item.species + '\', ' +
  item.age + ', \'' +
  item.habitat + '\', \'' +
  item.description + '\')">Editar</button></td>' +
                               '</tr>';
        });

        htmlTableAnimals += '</table>';
        $('#resultado').html(htmlTableAnimals);
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
                <p>Descripción: ${animal.description}</p>
            `;
            $('#resultado').html(htmlAnimal);
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

function openEditModal(id, name, species, age, habitat, description) {
  $('#edit-id').val(id);
  $('#edit-name').val(name);
  $('#edit-species').val(species);
  $('#edit-age').val(age);
  $('#edit-habitat').val(habitat);
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

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

