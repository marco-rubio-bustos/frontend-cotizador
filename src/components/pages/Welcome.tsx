import '../../css/form.css'
// types

const Welcome: React.FC = () => {
  return (
    <div className="container bg-light pb-5 px-4">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="mt-5">Bienvenido a la aplicación de cotizaciones</h1>
          <p className="lead">
            Aquí podrás gestionar tus clientes y cotizaciones de manera
            eficiente.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-1 border rounded-3 text-center">
          <p>Última cotización</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome
