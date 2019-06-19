Endireitar nomes dos eventos face aos métodos das acções.
   On change event ainda não está feito.
   On method directamente sem o dispatcher pelo meio
   ViewModel.days falta e refactor de Day.               DONE
   Fix removeEventListeners no window                    DONE
   this._onResize = this._onResize.bind(this)            DONE

TPC:
1. Endireitar o Calendar
2. Chamar acções do ViewModel para todas as acções mesmo que para mocks do lado do ViewModel DONE
3. Afinar alguns dos nomes dos métodos, se calhar em caminho IN PROGRESS
4. Stretch goal: endireitar os add/remove event listeners - DONE

5. Update the Render of the calendar in response to the selectedYear change instead of the way it is at the moment - DONE
6. Add the eventListeners for the navigation buttons using the element itself. - DONE
7. ViewModel.days falta e refactor de Day + acção para fazer o update do calendário - DONE
8. Render the calendar in response to the selection of the year - DONE
9. The event listener should automatically attach the handler when created - DONE

QUESTION:
1. About the events:
   a. I want to be able to trigger event that the users can listen to, I think this can easily be done with the
   eventDispatcher use, but there might be a better way. Check the DaysMouseActions example.


# 11-06-2019:
MultiSelectionChanged no view model -> estado do calendário - DONE

Não haver métodos públicos na View -> SettingsChanged
Eventos no ViewModel para cada tipo de acção.
 dispatch(“”, evento: {year, isCanceled}) cancelamento

SelectedDays ser lista de Days - DONE
ViewModel#toJSON & new ViewModel(json) -> localStorage

Point/Hover event
ViewModel#point(Day, x, y)
 dispatch(“point” evento: {day, x, y}
