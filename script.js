const availableTables = [
    { number: 1, reservations: [] },
    { number: 2, reservations: [] },
    { number: 3, reservations: [] },
    { number: 4, reservations: [] },
    { number: 5, reservations: [] },
    { number: 6, reservations: [] },
    { number: 7, reservations: [] },
    { number: 8, reservations: [] },
    { number: 9, reservations: [] },
    { number: 10, reservations: [] },
    { number: 11, reservations: [] },
    { number: 12, reservations: [] }
];

document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    document.getElementById('reserveButton').addEventListener('click', reserveTable);
    document.getElementById('reportButton').addEventListener('click', generateReport);
});

function renderTables() {
    const availableTablesDiv = document.getElementById('availableTables');
    const occupiedTablesDiv = document.getElementById('occupiedTables');

    availableTablesDiv.innerHTML = '';
    occupiedTablesDiv.innerHTML = '';

    availableTables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';

        tableDiv.innerHTML = `
            <img src="mesas.jpg" alt="Mesa ${table.number}" style="width:100px;">
            <div class="table-name">Mesa ${table.number}</div>
        `;

        if (table.reservations.length === 0) {
            const reserveButton = document.createElement('button');
            reserveButton.textContent = 'Reservar';
            reserveButton.onclick = () => reserveTableByNumber(table.number);
            tableDiv.appendChild(reserveButton);
            availableTablesDiv.appendChild(tableDiv);
        } else {
            const reservationsList = document.createElement('ul');
            table.reservations.forEach((res, index) => {
                const li = document.createElement('li');
                li.textContent = `${res.customer} - ${res.date} a las ${res.time}`;

                const freeButton = document.createElement('button');
                freeButton.textContent = 'Liberar';
                freeButton.style.marginLeft = '10px';
                freeButton.onclick = () => freeReservation(table.number, index);

                li.appendChild(freeButton);
                reservationsList.appendChild(li);
            });
            tableDiv.appendChild(reservationsList);
            occupiedTablesDiv.appendChild(tableDiv);
        }
    });
}

function reserveTableByNumber(number) {
    const table = availableTables.find(t => t.number === number);
    if (!table) return;

    const name = prompt("Nombre del cliente:");
    const dateTime = prompt("Fecha y hora de reserva (YYYY-MM-DDTHH:MM):");

    if (!name || !dateTime) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const [date, time] = dateTime.split('T');
    const exists = table.reservations.some(r => r.date === date && r.time === time);

    if (exists) {
        alert("Esa mesa ya está reservada en esa fecha y hora.");
        return;
    }

    table.reservations.push({ customer: name, date, time });
    alert(`Mesa ${number} reservada para ${name} el ${date} a las ${time}.`);
    renderTables();
}

function reserveTable() {
    const nameInput = document.getElementById('customerName');
    const tableInput = document.getElementById('tableNumber');
    const dateTimeInput = document.getElementById('reservationDateTime');

    const customerName = nameInput.value.trim();
    const tableNumber = parseInt(tableInput.value);
    const dateTime = dateTimeInput.value;

    if (!customerName || isNaN(tableNumber) || !dateTime) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const [date, time] = dateTime.split('T');

    const table = availableTables.find(t => t.number === tableNumber);

    if (!table) {
        alert('La mesa no existe.');
        return;
    }

    const alreadyReserved = table.reservations.some(r => r.date === date && r.time === time);

    if (alreadyReserved) {
        alert('Esa mesa ya está reservada en esa fecha y hora.');
        return;
    }

    table.reservations.push({ customer: customerName, date, time });
    alert(`Mesa ${tableNumber} reservada para ${customerName} el ${date} a las ${time}.`);

    nameInput.value = '';
    tableInput.value = '';
    dateTimeInput.value = '';

    renderTables();
}

function freeReservation(tableNumber, reservationIndex) {
    const table = availableTables.find(t => t.number === tableNumber);
    if (!table) return;

    table.reservations.splice(reservationIndex, 1);
    alert(`Reserva liberada en Mesa ${tableNumber}.`);
    renderTables();
}

function generateReport() {
    const reportOutput = document.getElementById('reportOutput');
    let reportText = 'Reporte de Reservas:\n\n';
    let total = 0;

    availableTables.forEach(table => {
        table.reservations.forEach(res => {
            reportText += `Mesa ${table.number}: ${res.customer} - ${res.date} a las ${res.time}\n`;
            total++;
        });
    });

    if (total === 0) {
        reportOutput.textContent = 'No hay reservas registradas.';
    } else {
        reportOutput.textContent = reportText;
    }
}
