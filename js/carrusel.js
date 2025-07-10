const htmlCarrusel =
`

<div class="conteCarrousel">
    <div class="itemCarrousel" id="itemCarrousel-1">
        <div class="itemCarrouselTarjeta">
            <img src="/images/item1.JPG" alt="">
        </div>
        <div class="itemCarrouselArrows">
            <span class="arrow-left" data-target="itemCarrousel-3">
                <i class="fas fa-chevron-left"></i>
            </span>
            <span class="arrow-right" data-target="itemCarrousel-2">
                <i class="fas fa-chevron-right"></i>
            </span>
        </div>
    </div>
    <div class="itemCarrousel" id="itemCarrousel-2">
        <div class="itemCarrouselTarjeta">
            <img src="/images/item2.jpg" alt="">
        </div>
        <div class="itemCarrouselArrows">
            <span class="arrow-left" data-target="itemCarrousel-1">
                <i class="fas fa-chevron-left"></i>
            </span>
            <span class="arrow-right" data-target="itemCarrousel-3">
                <i class="fas fa-chevron-right"></i>
            </span>
        </div>
    </div>
    <div class="itemCarrousel" id="itemCarrousel-3">
        <div class="itemCarrouselTarjeta">
            <img src="/images/item3.jpg" alt="">
        </div>
        <div class="itemCarrouselArrows">
            <span class="arrow-left" data-target="itemCarrousel-2">
                <i class="fas fa-chevron-left"></i>
            </span>
            <span class="arrow-right" data-target="itemCarrousel-1">
                <i class="fas fa-chevron-right"></i>
            </span>
        </div>
    </div>
</div>
   

` 

export async function Carrusel(){
    let d = document
    let seccionCarrusel = d.querySelector(".carrusel");
    seccionCarrusel.innerHTML = htmlCarrusel;

    const items = document.querySelectorAll('.itemCarrousel');
    const arrows = document.querySelectorAll('.itemCarrouselArrows span');
    let currentIndex = 0;
    function updateCarousel(index) {
        items.forEach((item, i) => {
            item.classList.remove('active', 'previous', 'next');
            if (i === index) {
                item.classList.add('active')
            } else if (i === (index - 1 + items.length) % items.length) {
                item.classList.add('previous');
            } else if (i === (index + 1) % items.length) {
                item.classList.add('next');
            }
        });
    }
    arrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const direction = this.classList.contains('arrow-left') ? -1 : 1;
            currentIndex = (currentIndex + direction + items.length) % items.length;
            updateCarousel(currentIndex);
        });
    });
    updateCarousel(currentIndex);
}