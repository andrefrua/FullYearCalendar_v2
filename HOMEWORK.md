Endireitar nomes dos eventos face aos métodos das acções.
   On change event ainda não está feito.
   On method directamente sem o dispatcher pelo meio
   ViewModel.days falta e refactor de Day.               DONE
   Fix removeEventListeners no window                    DONE
   this._onResize = this._onResize.bind(this)            DONE

TPC:
1. Endireitar o Calendar
2. Chamar acções do ViewModel para todas as acções mesmo que para mocks do lado do ViewModel
3. Afinar alguns dos nomes dos métodos, se calhar em caminho
4. Stretch goal: endireitar os add/remove event listeners - DONE

5. Update the Render of the calendar in response to the selectedYear change instead of the way it is at the moment - DONE
6. Add the eventListeners for the navigation buttons using the element itself. - DONE
7. ViewModel.days falta e refactor de Day + acção para fazer o update do calendário - DONE
8. Render the calendar in response to the selection of the year - DONE
9. The event listener should automatically attach the handler when created - DONE
