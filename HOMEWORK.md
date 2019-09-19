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

5. Update the Render of the calendar in response to the currentYear change instead of the way it is at the moment - DONE
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

Não haver métodos públicos na View -> SettingsChanged - DONE - Just left the `getSelectedDays()` and `dispose()`

Eventos no ViewModel para cada tipo de acção.
 dispatch(“”, evento: {year, isCanceled}) cancelamento - DONE - Not 100% sure this is the right approach

SelectedDays ser lista de Days - DONE

Point/Hover event
ViewModel#point(Day, x, y)
 dispatch(“point” evento: {day, x, y} - DONE



Delayed:
ViewModel#toJSON & new ViewModel(json) -> localStorage


# 25-06-19:

	• metodo() {
	•    super.metodo()
	• }
	• Class instance method vs class instance property with na arrow function.
      Arrow functions in class properties performance
      Arrow class properties are slower, but only on a micro level. Babel moves them to the constructor, so they are not reused between the class instances. Unless you are going to instantiate millions of components, the difference will be a few milliseconds for hundreds or even thousands of components. I am not going to create a benchmark to prove that since I would be basically measuring the cost of a function creation upon instantiation.


	• yearSelected -> currentYear
	• changeYearSelected -> protected
		○ changeToYear só redirect vale a pena?
		○ currentYear
		○ currentYearChanged
		○ currentYearChangeWill
		○ currentYearWillChange
		○ changeCurrentYear(year)
		○ changeCurrentYearToNext
		○ changeCurrentYearToPrevious
		○ incrementCurrentYear()
		○ decrementCurrentYear()
      Renamed the methods to
       changeCurrentYear
       incrementCurrentYear
       decrementCurrentYear


		○ currentYear
			§ dispatch("change:will:year", {year: {from, to}, isCanceled})
			§ dispatch("change:did:year", {year: {from, to}})
		○ selectedDays
			§ dispatch("change:will:selectedDays", {selectedDays, selectedDaysPrevious, isCanceled})
			§ dispatch("change:did:selectedDays", {selectedDays: {from, to}})
		○ settings
			§ dispatch("change:will:settings", {name, value, previous, isCanceled})
			§ dispatch("change:did:settings", {name, value, previous})
		○ dispatch("change:will", {name, value, previous, isCanceled})
			§ Name: "year", "selectedDays", ..."settings"...
		○ dispatch("change:did", {name, value, previous})

	• Dispose não permite ser chamado novamente / idempotentes - DONE

	• View#getSelectedDays
		○ Local e nome
		○ ViewModel#getFormattedSelectedDays()
		○ Genérico o suficiente para justificar existência?
		○ Útil para mais do q um utilizador/cenários?
		○ calendar/util
			§ formatDays(days) : formattedDays

      Decided to remove the method since the same can be accomplished directly using the information on the ViewModel

	• WillEvent. // Before
		○ get type
		○ get source
		○ get isCancelable
		○ get isCanceled
		○ cancel(reason: Error)
		○ cancelReason
	• DidEvent. // After
		•


foo = () => { return this; };
Bar = 3;

Constructor() {
  this.foo = () => { return this; };
  this.Bar = 3;

  var foo = this.foo;}
C



# 09-07-19:
Try to remove the Day class

ViewModel
 get/set weekStartDay: number;
 get/set currentYear : number;
 get     daysOfCurrentYear: Date[];

 get/set selectedDays(days: Date[]): Date[];

 isDaySelected(day: Date) : boolean
   _selectedDaysMap[ms] -> boolean

Utilitário complexidade constante (com cache)
 dayIndexOf(date, weekStartDay)
   * dayZeroIndex + firstDayOfMonth
   * firstDayOfMonth = f(year, month, weekStartDay)



# 30-07-2019
## Quanto à propriedade `selectedDays`
​
* `Event#customData` deveria passar para a View ou serem dois getters auxiliares do evento (`addedDays`, `removedDays`)
	- DONE
* `changeSelectedDays` passa a setter; o mesmo se aplica a outras funções "changeProp".
	- DONE
​
## Até que ponto a classe Day ainda é necessária?
	- Estava a ser usado como um facilitador. Mas tal como falámos foi removido de forma a reduzir a complexidade de
	utilização do calendário por terceiros.
​
## Oportunidades de melhoria ao sistema de eventos
​
### Alterações em barda
​
* Um único evento de property change
* get Event#changes -> Mapa de [propName] para {newValue, oldValue}.  (a la Angular)
* ViewModel#beginChanges()
  * inc changeDepth
* get ViewModel#isChanging
* ViewModel#__changes : [propName] -> oldValue
* ViewModel#endChanges()
  * dec changeDepth
  * Quando chega a zero, dispara o evento com as alterações que foram recolhidas
​
### Event#cancel([cancelReason: string | Error])
​
* get Event#cancelReason : Error
	- DONE
* Adição da fase RejectedChange (para além de WillChange e DidChange).
	- DONE
* Código na página HTML registar-se-ia no evento de rejeição para apresentar as mensagens no div de status
	- DONE - Also added a info property to the EventData in case extra information need to be passed
