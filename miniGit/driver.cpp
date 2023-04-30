#include "miniGit.hpp"
#include <iostream>
#include <string>
#include <iomanip>
#include <fstream>
#include <sstream>
#include <filesystem>

using namespace std;
namespace fs = std::filesystem;



void menu(){//output menu for main
    cout<<"========MENU========"<<endl;//output
    cout<<"Please Choose one of the following options below"<< endl; // output
    cout<<"1. Add a file from the current commit" << endl; //output
    cout<<"2. Remove files from the current commit" << endl; // output 
    cout<<"3. Commit changes"<<endl;//output
    cout<<"4. Check out version"<<endl;//output
    cout<<"5. QUIT"<< endl;//output choice quit
}

void myClass::initialize(){
    doublyNode * newNode = new doublyNode; //initialize the doubly linked list 
    newNode->next = NULL;
    newNode->previous = NULL;
    newNode->commitNumber = 0;
    head = NULL;
    father = newNode;
    commitCounter = 0;
}

int main(){//main
    myClass minigit;
    bool checkout = false;
    // minigit.commitCounter = 0;

    fs::remove_all(".minigit"); // removes a directory and its contents
    
    int option = 0;//user input for choice
    string decider = "";//initialize

    cout << "Would you like to initialize an empty repository in the current directory? (yes/no)"<< endl;
    cin>> decider;//receive user input
    if (decider != "yes"){
        cout << "Since you do not want to initialize, this program will now end....bye" << endl;
    }
    else 
    {
        fs::create_directory(".minigit");  // create a new directory

        minigit.initialize();
        while(option!=5){//5==quit

            menu();//
            //getline(cin,option);//need to fix
            cin>>option;//user input

            switch(option) {// handle userInput
                case 1: {
                    if(checkout != true)
                    {
                        minigit.addFiles();//call to function
                        minigit.showList();
                    }
                    break;
                }
                case 2: {
                    if(checkout != true)
                    {
                        minigit.removeFiles();
                        minigit.showList();
                    }
                    break;
                }

                case 3: {
                    if(checkout != true)
                    {
                        minigit.commit();
                    }
                    break;
                }

                case 4: {
                    // checkout = minigit.checkout();
                    minigit.checkout();
                    //minigit.checkout();
                    //checkout = false;
                    
                    
                    break;
                }

                case 5: {
                    cout << "Gooodbye!" <<endl;

                    break;
                }

            }
        }
    }

   
    return 0;//return
}



