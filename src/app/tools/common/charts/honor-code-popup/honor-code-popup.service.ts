import {Injectable} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HonorCodePopupComponent} from "./honor-code-popup.component";

@Injectable({
  providedIn: 'root'
})
export class HonorCodePopupService {

  constructor(private modalService: NgbModal) {
  }

  honored() {
    const modalRef = this.modalService.open(HonorCodePopupComponent);
    return modalRef.result;
  }
}
