import React from 'react'
import "./../css/Contacto.css"

export default function Contacto(){
return (
    <>
<main className="contact-wrapper">
<h1 className="contact-title">📞 Contacto</h1>


<div className="contact-container">
<section className="contact-info">
<h2>Contáctanos</h2>
<p>Si tienes dudas, sugerencias o necesitas ayuda con tus reservas, escríbenos:</p>
<ul>
<li><strong>Teléfono:</strong> +57 300 123 4567</li>
<li><strong>Email:</strong> soporte@cinecolombia.com</li>
<li><strong>Dirección:</strong> Calle 123 #45-67, Bogotá</li>
</ul>
</section>


<section className="contact-form">
<h2>Formulario de contacto</h2>
<form onSubmit={(e)=>{e.preventDefault(); alert('Mensaje enviado')}}>
<label htmlFor="name">Nombre:</label>
<input type="text" id="name" name="name" required />


<label htmlFor="email">Correo electrónico:</label>
<input type="email" id="email" name="email" required />


<label htmlFor="message">Mensaje:</label>
<textarea id="message" name="message" rows="5" required></textarea>


<button type="submit">Enviar mensaje</button>
</form>
</section>
</div>

</main>

      <footer className="footer">
        <p>&copy; 2025 Cine Reservas | Todos los derechos reservados.</p>
      </footer>
    </>
)
}