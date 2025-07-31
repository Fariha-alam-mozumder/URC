 src="https://cdn.tailwindcss.com"


// common function
function calculatedamount(inputamount, prevbdt) {
    const amountNumber = parseFloat(inputamount);
    const inputNumber = parseFloat(prevbdt);
    const currentbdt = amountNumber + inputNumber; 

    const maintaka = document.getElementById('mainamount').innerText;
    const mainbalance = parseFloat(maintaka);
    const total = mainbalance - amountNumber;
    document.getElementById('mainamount').innerText = total;
         return currentbdt;
}


//modal function
function showModal(){
    const modal =document.getElementById('modal-div');
    modal.style.display='block';
    
    }


//donation-for-noakhali
document.getElementById('ndonatebox').addEventListener('click', function(event) {
    event.preventDefault();
    const prevbdt = document.getElementById('nbdt').innerText; 
    const inputamount = document.getElementById('namount').value;
    if (isNaN(inputamount) || inputamount === "") {
        alert('Invalid donation amount');
    } else {
        const totalbdt = calculatedamount(inputamount, prevbdt); 
        document.getElementById('nbdt').innerText = totalbdt; 

        // showing history
        const div = document.createElement('div'); 
        div.classList.add('border', 'rounded-xl', 'px-5', 'py-5', 'mx-16');
        const date = new Date().toLocaleString(); 
        div.innerHTML = `
            <h4 class="text-lg lg:text-xl font-bold">${inputamount} taka is Donated for Famine-2024 at Noakhali, Bangladesh</h4>
            <p class="text-black opacity-70 text-sm">${date}</p>`;
        document.getElementById('hist').appendChild(div);
        
        //modal appearance
        modaldiv.showModal();
        
    }
});




//donation-for-feni
document.getElementById('fdonatebox').addEventListener('click', function(event) {
    event.preventDefault();
    const fprevbdt = document.getElementById('fbdt').innerText; 
    const finputamount = document.getElementById('famount').value;
    if (isNaN(finputamount) || finputamount === "") {
        alert('Invalid donation amount');
    } else {
        const ftotalbdt = calculatedamount(finputamount, fprevbdt); 
        document.getElementById('fbdt').innerText = ftotalbdt; 

        // showing history
        const div = document.createElement('div'); 
        div.classList.add('border', 'rounded-xl', 'px-5', 'py-5', 'mx-16');
        const date = new Date().toLocaleString(); 
        div.innerHTML = `
            <h4 class="text-lg lg:text-xl font-bold">${finputamount} taka is Donated for Famine-2024 at Noakhali, Bangladesh</h4>
            <p class="text-black opacity-70 text-sm">${date}</p>`;
        document.getElementById('hist').appendChild(div);
        
        //modal appearance
        modaldiv.showModal();
        
    }
});





//donation-for-quota
document.getElementById('qdonatebox').addEventListener('click', function(event) {
    event.preventDefault();
    const prevbdt = document.getElementById('qbdt').innerText; 
    const inputamount = document.getElementById('qamount').value;
    if (isNaN(inputamount) || inputamount === "") {
        alert('Invalid donation amount');
    } else {
        const totalbdt = calculatedamount(inputamount, prevbdt); 
        document.getElementById('qbdt').innerText = totalbdt; 

        // showing history
        const div = document.createElement('div'); 
        div.classList.add('border', 'rounded-xl', 'px-5', 'py-5', 'mx-16');
        const date = new Date().toLocaleString(); 
        div.innerHTML = `
            <h4 class="text-lg lg:text-xl font-bold">${inputamount} taka is Donated for Famine-2024 at Noakhali, Bangladesh</h4>
            <p class="text-black opacity-70 text-sm">${date}</p>`;
        document.getElementById('hist').appendChild(div);
        
        
        //modal appearance
        modaldiv.showModal();
        
    }
});






