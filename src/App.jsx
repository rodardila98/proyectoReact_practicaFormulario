import './App.css'
import { useState } from 'react'

function App() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [edad, setEdad] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  async function eliminarUsuario(idUsuario){

      let response = await fetch(`http://localhost:3001/usuarios/${idUsuario}`,{
        method: "DELETE"
      });

      if (response.ok) {
        setMensaje("Usuario eliminado correctamente");
        await consultarUsuario();
      }
    
  }

  async function cargarDatosActualizar(usuario){

    await setIdEditando(usuario.id);
    await setNombre(usuario.nombre);
    await setApellido(usuario.apellido);
    await setDocumento(usuario.documento);
    await setEdad(usuario.edad);
    await setMensaje("Cargando datos para actualizar...");

  }

  async function actualizarUsuario(){

    const usuarioActualizado = await {
      nombre: nombre,
      apellido: apellido,
      documento: documento,
      edad: edad
    };

    let response = await fetch(`http://localhost:3001/usuarios/${idEditando}`,{
      method: "PATCH",
      headers:{
        "Content-Type": "application/json"
      },
      body: await JSON.stringify(usuarioActualizado)
    });

    if(response.ok){
      setNombre("");
      setApellido("");
      setDocumento("");
      setEdad("");
      setIdEditando(null);
      setMensaje("Usuario actualizado correctamente");

      await consultarUsuario();
    }
    
  }

  async function consultarUsuario(){

    let response = await fetch("http://localhost:3001/usuarios")
    let data = await response.json();

    await setUsuarios(data);
  }

  async function guardarUsuario() {

    const nuevoUsuario = await {
      nombre: nombre,
      apellido: apellido,
      documento: documento,
      edad: edad
    };

    if (!nombre || !apellido || !documento || !edad) {

      setMensaje("Por favor, complete todos los campos");
      
      return;
    }

    // Guardado local en Array
    //setUsuarios([...usuarios, nuevoUsuario]);

    let response = await fetch("http://localhost:3001/usuarios",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: await JSON.stringify(nuevoUsuario)
    })

    if(response.ok){
      setNombre("");
      setApellido("");
      setDocumento("");
      setEdad("");
      setMensaje("Usuario guardado correctamente");

      await consultarUsuario();
    }
  }

  return (

    <div style={{ padding: "20px" }}>
      <h1>Registro de usuarios</h1>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br/><br/>
      <input type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <br/><br/>
      <input
        type="text"
        placeholder="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
      />
      <br/><br/>
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />
      <br/><br/>
      <button onClick={guardarUsuario}>
        Guardar
      </button>

      <button onClick={actualizarUsuario} disabled={!idEditando}>
        Actualizar
      </button>
      
      <button onClick={consultarUsuario}>
        Obtener usuarios
      </button>

      <h3>{mensaje}</h3>
      <h2>Total usuarios: {usuarios.length}</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Documento</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.documento}</td>
              <td>{usuario.edad}</td>
              <td>
                <button onClick={() => cargarDatosActualizar(usuario)}>
                  Actualizar
                </button>
                <button onClick={() => eliminarUsuario(usuario.id)}>
                  Eliminar
                </button>
              </td>
              {/* <td>
                <button onClick={() => eliminarUsuario(usuario.id)}>
                  Eliminar
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App