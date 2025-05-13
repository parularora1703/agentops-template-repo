from transitions import Machine

class OrderStateMachine:
    states = ["waiting", "confirmed", "prepared", "served", "completed"]

    def _init_(self, order):
        self.order = order
        self.machine = Machine(model=self, states=OrderStateMachine.states, initial="waiting")

        # Adding transitions
        self.machine.add_transition("confirm", "waiting", "confirmed", before="validate_order")
        self.machine.add_transition("prepare", "confirmed", "prepared", before="check_inventory")
        self.machine.add_transition("serve", "prepared", "served", after="send_notification")
        self.machine.add_transition("complete", "served", "completed", after="finalize_order")

    # Callback methods
    def validate_order(self):
        if not self.order.is_valid():
            raise ValueError("Order is invalid. Cannot confirm.")
        print("Order validated successfully.")
    
    def check_inventory(self):
        if not self.order.has_sufficient_inventory():
            raise ValueError("Insufficient inventory. Cannot prepare.")
        print("Inventory checked and sufficient.")
    
    def send_notification(self):
        print(f"Notification: Order {self.order.id} is ready to be served!")
    
    def finalize_order(self):
        print(f"Order {self.order.id} has been completed successfully.")

# Assuming Order is an object with the methods is_valid() and has_sufficient_inventory()
class Order:
    def _init_(self, id, items):
        self.id = id
        self.items = items

    def is_valid(self):
        return len(self.items) > 0  # Order must have at least one item
    
    def has_sufficient_inventory(self):
        # Check inventory logic (example: check stock availability for items)
        return True  # Assume inventory is sufficient for now

# Example usage:
order = Order(id=123, items=["Pizza", "Coke"])
order_machine = OrderStateMachine(order)
order_machine.confirm()  # Transitions from 'waiting' to 'confirmed'
order_machine.prepare()  # Transitions from 'confirmed' to 'prepared'
order_machine.serve()  # Transitions from 'prepared' to 'served'
order_machine.complete()  # Transitions from 'served' to 'completed'