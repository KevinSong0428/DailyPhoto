// for disabling form submissions if there are any invalid fields
(() => {
    'use strict'

    // Fetch all forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over every form and prevent wrongful submissions
    Array.from(forms).forEach(form => {
        form.addEventListener("submit", event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add("was-validated")
        }, false)
    })
})()