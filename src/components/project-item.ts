import { autobind } from '../decorators/autobind';
import {Draggable} from '../models/drag-drop.interfaces';
import { Project } from '../models/project';
import { Component } from './base-component';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  public get persons() : string {
    const peopleNum = +this.project.people;
    return peopleNum > 1 ? peopleNum + ' Persons' : '1 Person';
  }
  
  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move';
  }
  @autobind
  dragEndHandler(event: DragEvent): void {
    console.log(event)
  }

  configure(){
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
