import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { truncate } from 'fs';
import { Button } from 'protractor';
import { CONTEXT } from '@angular/core/src/render3/interfaces/view';
import { create } from 'domain';
import { CreateComponentOptions } from '@angular/core/src/render3/component';

interface IPromise<T> {
  (value?: T | PromiseLike<T>): void;
  (reason?: T | PromiseLike<T>): void;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})

export class TestComponent implements OnInit {
  @ViewChildren('allTheseThings') things: QueryList<any>;
  user_floor: HTMLInputElement;
  user_floor_value: number;
  elevator_floor: number;
  elevator_box: HTMLElement;
  btn_summon: HTMLButtonElement;
  floors_max: HTMLInputElement;
  maxValue: number;
  minValue: number;
  elevator_position: number;
  floor_height: number;
  floors_list: HTMLElement[];
  buttons_list: HTMLElement[];
  li_parent: HTMLUListElement;
  li_elements: HTMLElement[] = [];
  btn_floor_accept: HTMLButtonElement;
  btn_user_floor_accept: HTMLButtonElement;
  btn_generation: HTMLButtonElement;
  buttons_parent: HTMLDivElement;
  button_elements: HTMLElement[] = [];
  elevator_box_parent: HTMLDivElement;
  btn_summon_parent: HTMLDivElement;

  constructor() {}

  ngAfterViewInit(): void {
    this.things.changes.subscribe(() => {
      this.liArray();
      this.elevator_box = document.querySelector('.elevator-box');
      this.elevator_floor = this.randomInteger();
      console.log('elevator', this.elevator_floor);
      this.elevatorPosition();
      this.elevatorMove();
      this.buttonsArray();
      this.btnSummon();
    });
  }

  ngOnInit(): void {
    this.buttons_parent = document.querySelector('.elevator-buttons');
    this.elevator_box_parent = document.querySelector('.elevator_box_parent');
    this.btn_summon_parent = document.querySelector('.btn_summon_parent');
    this.li_parent = document.querySelector('.li_parent');
    this.floors_max = document.querySelector('.floors_max_value') as HTMLInputElement;
    this.user_floor = document.querySelector('.user_floors_value') as HTMLInputElement;
    this.btn_floor_accept =  document.querySelector('.floor_btn');
    this.btn_user_floor_accept = document.querySelector('.user_btn');
    this.btn_generation = document.querySelector('.generation_btn');
    this.maxValue = parseInt(this.floors_max.value, 10);
    this.minValue = 1;
    this.elevator_position = 0;
    this.valueInit();
    this.elevatorGeneration();
  }

  elevatorGeneration(): void {
    this.btn_generation.addEventListener('click', () => {
      this.structureGeneration();
    });
    this.btn_generation.disabled = true;
  }

  liArray(): void {
    this.floors_list = Array.from(document.querySelectorAll('li'));
    console.log(this.floors_list);
    this.li_parent.classList.add('floors');
    this.floor_height = this.floors_list[1].offsetHeight;
    console.log(this.floor_height);
  }

  valueInit(): void {
    this.btn_user_floor_accept.addEventListener('click', () => {
      this.user_floor_value = parseInt(this.user_floor.value, 10);
      if (this.user_floor_value != undefined) {
        this.btn_summon.disabled = false;
      }
      console.log('user', this.user_floor_value);
    });
    this.btn_floor_accept.addEventListener('click', () => {
      this.maxValue = parseInt(this.floors_max.value, 10);
      console.log('max-floors', this.floors_max.value);
      if (this.maxValue > 0) {
        this.btn_generation.disabled = false;
      }
    });
  }

  randomInteger(): number {
    let random: number = this.minValue + Math.random() * (this.maxValue - this.minValue);
    random = Math.round(random);

    return random;
  }
6
  structureGeneration(): void {
    for (let i: number = this.maxValue; i > 0; i--) {
      const li_elem: HTMLElement = document.createElement('li');
      this.li_elements.push(li_elem);
      const button_elem: HTMLElement = document.createElement('button');
      this.button_elements.push(button_elem);
    }

    const elevator_elem: HTMLElement = document.createElement('div');
    elevator_elem.className = 'elevator-box';
    this.elevator_box_parent.classList.add('elevator-output');
    this.elevator_box_parent.appendChild(elevator_elem);
    const summon_btn_elem: HTMLElement = document.createElement('button');
    summon_btn_elem.className = 'btn_summon';
    summon_btn_elem.innerHTML = 'Вызвать лифт';
    this.btn_summon_parent.classList.add('btn-summon-block');
    this.btn_summon_parent.appendChild(summon_btn_elem);
  }

  btnSummon(): void {
    this.btn_summon = document.querySelector('.btn_summon');
    this.btn_summon.disabled = true;
    if (this.user_floor_value != undefined) {
      this.btn_summon.disabled = false;
    }
    this.btn_summon.addEventListener('click', (e: MouseEvent) => {
      this.elevatorSummon();
    });
  }

  elevatorMove(): void {
    this.elevator_box.style.transform = 'translateY' + '(' + '-' + this.elevator_position + 'px' + ')';
  }

  buttonsArray(): void {
    this.buttons_list = Array.from(document.querySelectorAll('.elevator-button'));
    console.log(this.buttons_list);
    this.buttons_list.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', (e: MouseEvent) => {
        this.elevatorGo(e);
      });
      button.disabled = true;
    });
  }

  elevatorPosition(): void {
    this.elevator_position = (this.elevator_floor * this.floor_height) - this.floor_height;
  }

  elementsStyle(): void {
    if (this.elevator_floor === this.user_floor_value) {
      this.elevator_box.style.background = '#008000';
    } else {
      this.elevator_box.style.background = '#ff0000';
    }
  }

  elevatorSummon(): void {
    const interval: number = 1000;
    const context: TestComponent = this;
    const promise: Promise<string | number> = new Promise((resolve: IPromise<number>, reject: IPromise<string>): void => {
      if (context.elevator_floor < context.user_floor_value) {
        context.elevator_floor++;
        context.elevator_position += (this.floor_height);
        context.elevator_floor <= context.user_floor_value ? resolve(context.elevator_floor) : reject('stop');
      } else if (context.elevator_floor > context.user_floor_value) {
        context.elevator_floor--;
        context.elevator_position -= (this.floor_height);
        context.elevator_floor >= context.user_floor_value ? resolve(context.elevator_floor) : reject('stop');
      } else if (context.elevator_floor === context.user_floor_value) {
        reject('we are here!');
        this.elevator_box = document.querySelector('.elevator-box');
        this.btn_summon.disabled = true;
        this.buttons_list.forEach((button: HTMLButtonElement) => {
          button.disabled = false;
        });
      }
    });

    promise
      .then((x: number): void => {
        setTimeout(() => {
          console.info(x);
          this.elementsStyle();
          this.elevatorSummon();
        }, interval);
      })
      .then((x: void): void => {
        this.elevatorMove();
      })
      .catch((error: string) => {
        console.error(error);
      });
  }

  elevatorGo(event: any): void {
    const button_index: number = this.buttons_list.lastIndexOf(event.target) + 1;
    console.log('Buttons', button_index);
    const interval: number = 1000;
    const context: TestComponent = this;

    if (this.elevator_floor && this.user_floor_value === button_index) {
      this.elevator_box.style.background = '#008000';
    } else {
      this.elevator_box.style.background = '#ff0000';
    }

    const promise: Promise<string | number> = new Promise((resolve: IPromise<number>, reject: IPromise<string>): void => {
      if (context.elevator_floor < button_index) {
        context.elevator_floor++;
        context.user_floor_value++;
        console.log('user_floor_value', context.user_floor_value);
        context.elevator_position += (context.floor_height);
        context.elevator_floor && context.user_floor_value <= button_index ? resolve(context.elevator_floor) : reject('stop');
      } else if (context.elevator_floor > button_index) {
        context.elevator_floor--;
        context.user_floor_value--;
        context.elevator_position -= (context.floor_height);
        context.elevator_floor && context.user_floor_value >= button_index ? resolve(context.elevator_floor) : reject('stop');
      } else if (context.elevator_floor === button_index) {
        reject('we are here!');
        this.btn_summon.disabled = false;
      }
    });

    promise
      .then((x: number): void => {
        setTimeout(() => {
          console.info(x);
          this.elevatorGo(event);
        }, interval);
      })
      .then((x: void): void => {
        this.elevatorMove();
      })
      .catch((error: string) => {
        console.error(error);
      });
  }

}
