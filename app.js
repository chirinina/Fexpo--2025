
      function showToast(message, type = "success") {
        const toast = document.createElement("div");

        // Estilos base + color según tipo
        const baseClasses =
          "animate-slide-in px-4 py-2 rounded shadow-lg text-white font-semibold flex items-center gap-2";
        let bgColor = "bg-green-500";
        if (type === "error") bgColor = "bg-red-500";
        if (type === "info") bgColor = "bg-blue-500";

        toast.className = `${baseClasses} ${bgColor}`;
        toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 text-sm">✖</button>
    `;

        document.getElementById("toast-container").appendChild(toast);

        // Eliminar automáticamente después de 3s
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }
    </script>

    <script>
      // CACHE AGGRESIVO DE ELEMENTOS (solo una vez al inicio)
      const elements = {
        // Tabs y formulario
        tabs: document.querySelectorAll(".tab-content"),
        tabButtons: document.querySelectorAll(".tab-button"),
        form: document.getElementById("formulario"),

        // Botones de navegación
        prevBtn: document.querySelector('[onclick="previousTab()"]'),
        nextBtn: document.querySelector('[onclick="nextTab()"]'),
        submitBtn: document.querySelector('[type="submit"]'),

        // Panel admin
        registroForm: document.getElementById("registroForm"),
        adminPanel: document.getElementById("adminPanel"),
        registrosTable: document.getElementById("registrosTable"),
        searchInput: document.getElementById("searchInput"),

        // Inputs del formulario (cache dinámico)
        inputs: {},
      };

      // Llenar cache de inputs de forma optimizada
      document
        .querySelectorAll("#formulario input, #formulario select")
        .forEach((input) => {
          elements.inputs[input.id] = input;
        });

      // ESTADO OPTIMIZADO
      const state = {
        currentTab: 0,
        registros: JSON.parse(localStorage.getItem("registrosFexpo")) || [],
        searchCache: new Map(), // Cache para búsquedas
      };

      // OPTIMIZACIÓN DE RENDERIZADO
      const renderRow = (registro) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 transition-all";
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-800">${registro.nombres} ${
          registro.apellido1
        }</td>
            <td class="px-6 py-4 text-sm text-gray-800">${registro.documento} ${
          registro.extension
        }</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <div class="text-gray-700">${registro.telefono}</div>
              <div class="text-blue-500 text-xs">${registro.email}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-800">${
              registro.profesion
            }</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <div class="flex flex-wrap gap-2 max-w-xs">
                ${registro.cursos
                  .map(
                    (curso) =>
                      `<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">${curso}</span>`
                  )
                  .join("")}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">${new Date(
              registro.timestamp
            ).toLocaleDateString()}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <button 
                onclick="deleteRecord('${registro.documento}')" 
                class="text-red-500 hover:text-red-700 transition-all"
                title="Eliminar registro"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          `;
        return tr;
      };

      // FUNCIÓN PARA ELIMINAR REGISTROS
      const deleteRecord = (documentId) => {
        if (confirm("¿Estás seguro de eliminar este registro?")) {
          // Filtrar el registro a eliminar
          state.registros = state.registros.filter(
            (reg) => reg.documento !== documentId
          );

          // Actualizar localStorage
          localStorage.setItem(
            "registrosFexpo",
            JSON.stringify(state.registros)
          );

          // Limpiar cache de búsquedas
          state.searchCache.clear();

          // Recargar registros
          loadRegistros();

          showToast("Registro eliminado correctamente");
        }
      };

      // TAB SYSTEM ULTRA OPTIMIZADO
      const showTab = (n) => {
        // Usar classList con múltiples clases para mejor performance
        elements.tabs.forEach((tab, index) => {
          tab.classList.toggle("active", index === n);
          tab.classList.toggle("hidden", index !== n);
        });

        elements.tabButtons.forEach((btn, index) => {
          const active = index === n;
          btn.classList.toggle("active", active);
          btn.classList.toggle("text-yellow-700", active);
          btn.classList.toggle("border-yellow-500", active);
        });

        // Optimización: Solo actualizar lo necesario
        elements.prevBtn.classList.toggle("hidden", n === 0);
        elements.submitBtn.classList.toggle("hidden", n !== 2);
        elements.nextBtn.classList.toggle("hidden", n === 2);
      };

      // NAVEGACIÓN CON CACHE
      const nextTab = () => {
        if (state.currentTab < 2) {
          state.currentTab++;
          showTab(state.currentTab);
        }
      };

      const previousTab = () => {
        if (state.currentTab > 0) {
          state.currentTab--;
          showTab(state.currentTab);
        }
      };

      // FORM HANDLER OPTIMIZADO
      const handleSubmit = (e) => {
        e.preventDefault();

        // Obtener valores de forma optimizada usando cache
        const formData = {
          nombres: elements.inputs.nombres.value.trim(),
          apellido1: elements.inputs.apellido1.value.trim(),
          apellido2: elements.inputs.apellido2.value.trim(),
          documento: elements.inputs.documento.value.trim(),
          extension: elements.inputs.extension.value.trim(),
          genero: elements.inputs.genero.value,
          fechaNacimiento: elements.inputs.fechaNacimiento.value,
          departamento: elements.inputs.departamento.value.trim(),
          ciudad: elements.inputs.ciudad.value.trim(),
          direccion: elements.inputs.direccion.value.trim(),
          grado: elements.inputs.grado.value,
          profesion: elements.inputs.profesion.value.trim(),
          institucion: elements.inputs.institucion.value.trim(),
          telefono: elements.inputs.telefono.value.trim(),
          email: elements.inputs.email.value.trim(),
          cursos: Array.from(elements.inputs.cursos.selectedOptions).map(
            (o) => o.value
          ),
          timestamp: new Date().toISOString(),
        };

        // Validación optimizada
        const requiredFields = [
          { field: formData.nombres, name: "Nombres" },
          { field: formData.apellido1, name: "Primer Apellido" },
          { field: formData.documento, name: "Documento" },
          { field: formData.genero, name: "Género" },
          { field: formData.fechaNacimiento, name: "Fecha de Nacimiento" },
          { field: formData.departamento, name: "Departamento" },
          { field: formData.ciudad, name: "Ciudad" },
          { field: formData.direccion, name: "Dirección" },
          { field: formData.grado, name: "Grado Académico" },
          { field: formData.profesion, name: "Profesión" },
          { field: formData.institucion, name: "Institución" },
          { field: formData.telefono, name: "Teléfono" },
          { field: formData.email, name: "Email" },
          { field: formData.cursos.length, name: "Cursos" },
        ];

        const missingField = requiredFields.find((item) => !item.field);
        if (missingField) {
          showToast(`⚠️ Campo obligatorio faltante: ${missingField.name}`);
          return;
        }

        // Validar documento único con búsqueda optimizada
        const exists = state.registros.some(
          (r) => r.documento === formData.documento
        );
        if (exists) {
          showToast("⚠️ Este documento ya está registrado");
          return;
        }

        // Actualizar estado y storage de forma optimizada
        state.registros = [...state.registros, formData];
        localStorage.setItem("registrosFexpo", JSON.stringify(state.registros));

        showToast("Registro exitoso");
        elements.form.reset();
        showTab(0);
      };

      // ADMIN PANEL OPTIMIZADO
      const toggleAdminPanel = () => {
        elements.registroForm.classList.toggle("hidden");
        elements.adminPanel.classList.toggle("hidden");

        if (!elements.adminPanel.classList.contains("hidden")) {
          loadRegistros();
        }
      };

      // RENDERIZADO ULTRA RÁPIDO CON DOCUMENT FRAGMENT
      const loadRegistros = () => {
        const fragment = document.createDocumentFragment();

        // Usar for loop clásico para mejor performance con muchos registros
        for (let i = 0; i < state.registros.length; i++) {
          fragment.appendChild(renderRow(state.registros[i]));
        }

        // Limpiar y renderizar en una sola operación
        elements.registrosTable.innerHTML = "";
        elements.registrosTable.appendChild(fragment);
      };

      // BÚSQUEDA CON CACHE Y DEBOUNCE
      const handleSearch = (() => {
        let timeout;
        return (e) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const term = e.target.value.toLowerCase();

            // Usar cache si está disponible
            if (state.searchCache.has(term)) {
              filterRows(state.searchCache.get(term));
              return;
            }

            const results = state.registros.filter((reg) =>
              JSON.stringify(reg).toLowerCase().includes(term)
            );

            // Actualizar cache
            state.searchCache.set(term, results);
            filterRows(results);
          }, 50);
        };
      })();

      // FILTRADO OPTIMIZADO
      const filterRows = (filteredData) => {
        const rows = elements.registrosTable.querySelectorAll("tr");
        const showAll = !filteredData;

        // Usar for loop clásico para mejor performance
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          row.style.display = showAll ? "" : "none";

          if (!showAll) {
            const registro = state.registros[i];
            if (filteredData.includes(registro)) {
              row.style.display = "";
            }
          }
        }
      };

      // EXPORTACIÓN RÁPIDA
      const exportToExcel = () => {
        const datosParaExcel = state.registros.map((registro) => ({
          ...registro,
          cursos: registro.cursos.join(", "),
        }));

        const ws = XLSX.utils.json_to_sheet(datosParaExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registros");
        XLSX.writeFile(wb, "registros_fexpo.xlsx");
      };

      const exportToPDF = () => {
        // Configuración del documento en horizontal (landscape) y tamaño oficio/legal
        const doc = new jspdf.jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "legal",
        });

        // Título del reporte
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(
          "REPORTE DE REGISTROS - FEXPO",
          doc.internal.pageSize.width / 2,
          15,
          { align: "center" }
        );

        // Generar la tabla con todos los campos requeridos
        doc.autoTable({
          startY: 20, // Espacio después del título
          head: [
            [
              "Nombres",
              "Primer Apellido",
              "Documento",
              "Género",
              "Fecha Nac.",
              "Departamento",
              "Ciudad",
              "Dirección",
              "Grado Académico",
              "Profesión",
              "Institución",
              "Teléfono",
              "Email",
              "Cursos",
            ],
          ],
          body: state.registros.map((r) => [
            r.nombres || "",
            r.apellido1 || "",
            `${r.documento || ""} ${r.extension || ""}`.trim(),
            r.genero || "",
            r.fechaNacimiento || "",
            r.departamento || "",
            r.ciudad || "",
            r.direccion || "",
            r.grado || "",
            r.profesion || "",
            r.institucion || "",
            r.telefono || "",
            r.email || "",
            r.cursos?.join(", ") || "",
          ]),
          theme: "grid",
          styles: {
            fontSize: 7, // Tamaño de fuente más pequeño para caber todo
            cellPadding: 1.5,
            overflow: "linebreak",
            minCellHeight: 5,
          },
          headStyles: {
            fillColor: [234, 179, 8], // Amarillo
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          margin: { top: 20 },
          tableWidth: "auto", // Ajusta el ancho automáticamente
          columnStyles: {
            0: { cellWidth: "auto" }, // Nombres
            1: { cellWidth: "auto" }, // Apellido
            2: { cellWidth: 20 }, // Documento
            3: { cellWidth: 15 }, // Género
            4: { cellWidth: 20 }, // Fecha Nac.
            5: { cellWidth: "auto" }, // Departamento
            6: { cellWidth: "auto" }, // Ciudad
            7: { cellWidth: "auto" }, // Dirección
            8: { cellWidth: "auto" }, // Grado
            9: { cellWidth: "auto" }, // Profesión
            10: { cellWidth: "auto" }, // Institución
            11: { cellWidth: 20 }, // Teléfono
            12: { cellWidth: "auto" }, // Email
            13: { cellWidth: 30 }, // Cursos (más ancho)
          },
          pageBreak: "auto",
          overflow: "linebreak",
        });

        // Guardar el PDF
        doc.save("registros_fexpo.pdf");
      };

      // INICIALIZACIÓN RÁPIDA
      const init = () => {
        // Asignar eventos de forma optimizada
        elements.form.addEventListener("submit", handleSubmit);
        elements.searchInput.addEventListener("input", handleSearch);

        // Mostrar primera tab
        showTab(0);

        // Precargar datos si es necesario
        if (state.registros.length > 0) {
          requestIdleCallback(() => {
            loadRegistros();
          });
        }
      };

      // Iniciar cuando el DOM esté listo
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
      } else {
        init();
      }

        function togglePasswordPrompt() {
          const prompt = document.getElementById("passwordPrompt");
          prompt.classList.toggle("hidden");
          document.getElementById("passwordMessage").classList.add("hidden");
          document.getElementById("adminPassword").value = "";
          document.getElementById("adminPassword").type = "password";
          resetEyeIcon();
        }

        function togglePasswordVisibility() {
          const passwordInput = document.getElementById("adminPassword");
          const eyeIcon = document.getElementById("eyeIcon");

          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        `;
          } else {
            passwordInput.type = "password";
            resetEyeIcon();
          }
        }

        function resetEyeIcon() {
          document.getElementById("eyeIcon").innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      `;
        }

        function checkPassword() {
          const inputPassword = document.getElementById("adminPassword").value;
          const message = document.getElementById("passwordMessage");
          const correctPassword = "sistemas";

          message.classList.remove(
            "hidden",
            "bg-red-100",
            "text-red-700",
            "bg-green-100",
            "text-green-700",
            "dark:bg-red-900/30",
            "dark:text-red-300",
            "dark:bg-green-900/30",
            "dark:text-green-300"
          );

          if (inputPassword === correctPassword) {
            message.textContent = "✓ Acceso autorizado redirigiendo...";
            message.classList.add(
              "bg-green-100",
              "text-green-700",
              "dark:bg-green-900/30",
              "dark:text-green-300"
            );
            setTimeout(() => {
              toggleAdminPanel();
              togglePasswordPrompt();
            }, 800);
          } else {
            message.textContent =
              "✗ Credenciales incorrectas. Intente nuevamente.";
            message.classList.add(
              "bg-red-100",
              "text-red-700",
              "dark:bg-red-900/30",
              "dark:text-red-300"
            );
          }
        }
