import '../assets/css/rankToysStyle.css'
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import styles from '../assets/css/rankToys.module.css';
import TierList from '../components/rank/TierList';
import UncategorisedToys from '../components/rank/UncategorisedToys';
import DraggableToy from '../components/rank/DraggableToy';

const toysPlaceholder = [[<DraggableToy id="A939517B"/>, <DraggableToy id="040FBBAB"/>],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        ];


export default function RankToys() : JSX.Element {
    const [toys, setToys] = useState<JSX.Element[][]>([[],[],[],[],[],[],[]]);
    async function loadToys() : Promise<void> {
        setToys(toysPlaceholder);
    }
    useEffect(() => {
        loadToys();
    }, []);

    const moveToys = (id:string, origin:number, destination:number) => {
        if (origin === destination) return;
        setToys(prevToys=>{
            const newToys = prevToys.map(row => [...row]); // to trigger a re-render

            const toyToMove = newToys[origin].find((toy) => toy.props.id === id);
    
            if (toyToMove) {
                newToys[destination] = [...newToys[destination], toyToMove];
                newToys[origin] = newToys[origin].filter((toy) => toy.props.id !== id);
            }
    
            return newToys;
    });
    }

    return(
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.mainPage}>
                <TierList tierTable={toys.slice(1)} moveHandler={moveToys}/>
                <UncategorisedToys toys={toys[0]} moveHandler={moveToys}/>
            </div>
        </DndProvider>
    );
}


// export default function RankToys() : JSX.Element {
//     return (
//         <div className="page-rank-ideas">
//             {/* Left section: */}
//             <div className="page-section"></div>
//             <div className="my-wishes">My wishes!</div>
//             {/* Images */}
//             <div className="image-row" draggable="true">
//                 <div className="blacksquare"></div>
//                 <img className="image1" src="https://media.istockphoto.com/id/909772478/photo/brown-teddy-bear-isolated-in-front-of-a-white-background.jpg?s=612x612&w=0&k=20&c=F4252bOrMfRTB8kWm2oM2jlb9JXY08tKCaO5G_ms1Uw=" alt="teddy bear" />
//                 {/* <div className="image2"></div>
//                 <div className="image3"></div> */}
//             </div>


//             {/* Buttons */}
//             <button type="button" className="save-button">
//                 <div className="save">Save</div>
//             </button>

//             <button type="button" className="edit-button">
//                 <div className="edit">Edit</div>
//             </button>
//             <button type="button" className="delete-all-button">
//                 <div className="delete-all">Delete all</div>
//             </button>

//             <div className="rank-your-wishes">Rank your wishes!</div>
            
//             {/* Table */}
//             <div className="table">
//                 <div className="row">
//                     <div className="cell">
//                         <div className="content">
//                             <div className="text">S</div>
//                         </div>  
//                     </div>
//                     <div className="cell1">
//                         <div className="content">
//                             <div className="text"></div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="cell2">
//                     <div className="content">
//                         <div className="text">A</div>
//                     </div>
//                     </div>
//                     <div className="cell1">
//                     <div className="content">
//                         <div className="text"></div>
//                     </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="cell4">
//                     <div className="content">
//                         <div className="text">B</div>
//                     </div>
//                     </div>
//                     <div className="cell1">
//                     <div className="content">
//                         <div className="text"></div>
//                     </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="cell6">
//                     <div className="content">
//                         <div className="text">C</div>
//                     </div>
//                     </div>
//                     <div className="cell1">
//                     <div className="content">
//                         <div className="text"></div>
//                     </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="cell8">
//                     <div className="content">
//                         <div className="text">D</div>
//                     </div>
//                     </div>
//                     <div className="cell1">
//                     <div className="content">
//                         <div className="text"></div>
//                     </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="cell10">
//                     <div className="content">
//                         <div className="text">F</div>
//                     </div>
//                     </div>
//                     <div className="cell1">
//                     <div className="content">
//                         <div className="text"></div>
//                     </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }








// document.addEventListener("DOMContentLoaded", () => {
//     const image = document.getElementsByClassName("image-row")[0] as HTMLElement;

//     // Drag and drop functionality
//     let draggedItem: HTMLElement | null = null;
  
//     image.addEventListener("dragstart", (e) => {
//       if (e.target instanceof HTMLElement && e.target.classList.contains("draggable")) {
//         draggedItem = e.target.parentElement as HTMLElement;
//         draggedItem.classList.add("dragging");
//       }
//     });
  
//     // image.addEventListener("dragover", (e) => {
//     //   e.preventDefault();
//     // //   const afterElement = getDragAfterElement(image, e.clientY);
//     //   const draggable = draggedItem as HTMLElement;
  
//     // //   if (afterElement == null) {
//     // //     image.appendChild(draggable);
//     // //   } else {
//     // //     image.insertBefore(draggable, afterElement);
//     // //   }
//     // });
  
//     image.addEventListener("dragend", () => {
//       if (draggedItem) {
//         draggedItem.classList.remove("dragging");
//         draggedItem = null;
//       }
//     });
  
//     // function getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
//     //   const draggableElements = Array.from(container.querySelectorAll(".draggable:not(.dragging)"));
//     //   return draggableElements.reduce((closest, child) => {
//     //     const box = child.getBoundingClientRect();
//     //     const offset = y - box.top - box.height / 2;
//     //     if (offset < 0 && offset > closest.offset) {
//     //       return { offset, element: child };
//     //     } else {
//     //       return closest;
//     //     }
//     //   }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
//     // }
//    });